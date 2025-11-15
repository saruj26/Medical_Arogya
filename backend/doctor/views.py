
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import send_mail
from django.conf import settings
import logging

from core.models import User
from .models import DoctorProfile
from .serializers import DoctorProfileSerializer, DoctorCreateSerializer
from .models import DoctorTip
from .serializers_tips import DoctorTipSerializer, DoctorTipCreateSerializer
from .models import DoctorReview
from .serializers import DoctorReviewSerializer, DoctorReviewCreateSerializer

logger = logging.getLogger(__name__)

class DoctorListView(APIView):
    # Allow public access to list doctors (used by customer browsing). Creation
    # of doctors is handled in DoctorCreateView and remains admin-only.
    permission_classes = [AllowAny]

    def get(self, request):
        doctors = DoctorProfile.objects.select_related('user').all()
        serializer = DoctorProfileSerializer(doctors, many=True)

        return Response({
            'success': True,
            'doctors': serializer.data
        })

class DoctorCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if request.user.role != 'admin':
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = DoctorCreateSerializer(data=request.data)
        if serializer.is_valid():
            doctor_profile = serializer.save()
            
            # Send email to doctor with credentials. Use a safe default for FRONTEND_URL
            email_sent = False
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            subject = 'Welcome to Arogya - Doctor Account Created'
            message = f"""
Welcome to Arogya!

Your doctor account has been created with the following details:
Email: {doctor_profile.user.email}
Temporary Password: {request.data.get('password')}

Please log in and change your password immediately for security.
You must complete your profile before you can start accepting appointments.

Login at: {frontend_url}

Best regards,
Arogya Admin Team
"""

            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [doctor_profile.user.email],
                    fail_silently=False,
                )
                email_sent = True
            except Exception:
                # Log the exception; don't fail the doctor creation
                logger.exception("Failed to send doctor creation email to %s", doctor_profile.user.email)
            
            return Response({
                'success': True,
                'message': 'Doctor added successfully',
                'doctor': DoctorProfileSerializer(doctor_profile).data,
                'email_sent': email_sent,
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Failed to add doctor',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class DoctorProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'doctor':
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            doctor_profile = DoctorProfile.objects.get(user=request.user)
            serializer = DoctorProfileSerializer(doctor_profile)

            return Response({
                'success': True,
                'profile': serializer.data
            })
        except DoctorProfile.DoesNotExist:
            # If a doctor user exists but doesn't yet have a DoctorProfile,
            # create a placeholder profile so the frontend can show the
            # profile editing UI and persist details on first save.
            try:
                # Generate a unique doctor_id similar to DoctorCreateSerializer
                last = DoctorProfile.objects.exclude(doctor_id__isnull=True).order_by('-id').first()
                if last and last.doctor_id and last.doctor_id.startswith('DOC'):
                    try:
                        num = int(last.doctor_id.replace('DOC', '')) + 1
                    except Exception:
                        num = DoctorProfile.objects.count() + 1
                else:
                    num = DoctorProfile.objects.count() + 1

                doctor_id = f"DOC{num:03d}"

                doctor_profile = DoctorProfile.objects.create(
                    user=request.user,
                    doctor_id=doctor_id,
                    available_days=[],
                    available_time_slots=[],
                    bio=''
                )

                serializer = DoctorProfileSerializer(doctor_profile)
                return Response({
                    'success': True,
                    'profile': serializer.data
                })
            except Exception:
                return Response({
                    'success': False,
                    'message': 'Doctor profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        if request.user.role != 'doctor':
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            doctor_profile = DoctorProfile.objects.get(user=request.user)
            serializer = DoctorProfileSerializer(doctor_profile, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                
                # ✅ CORRECT: Check if all required fields have non-empty values
                updated_profile = DoctorProfile.objects.get(user=request.user)
                required_fields = ['specialty', 'experience', 'qualification', 'bio']
                
                # Check if all required fields have values
                has_all_fields = all(
                    getattr(updated_profile, field) and 
                    len(str(getattr(updated_profile, field)).strip()) > 0 
                    for field in required_fields
                )
                
                # Check if availability is set
                has_availability = (
                    updated_profile.available_days and 
                    len(updated_profile.available_days) > 0 and
                    updated_profile.available_time_slots and 
                    len(updated_profile.available_time_slots) > 0
                )
                
                # Update completion status
                is_complete = has_all_fields and has_availability
                if is_complete != updated_profile.is_profile_complete:
                    updated_profile.is_profile_complete = is_complete
                    updated_profile.save()
                
                return Response({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'profile': DoctorProfileSerializer(updated_profile).data
                })
            
            return Response({
                'success': False,
                'message': 'Profile update failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except DoctorProfile.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Doctor profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class DoctorTipsListCreateView(APIView):
    """GET: list published tips (public).
       POST: create a new tip (doctor only).
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # If the authenticated doctor requests their own tips (mine=1), return
        # all tips authored by them (including unpublished). Otherwise return
        # only published tips for public consumption.
        mine = request.query_params.get('mine')
        if mine and request.user.is_authenticated and getattr(request.user, 'role', None) == 'doctor':
            try:
                doctor_profile = DoctorProfile.objects.get(user=request.user)
                tips = DoctorTip.objects.filter(doctor=doctor_profile).select_related('doctor__user')
            except DoctorProfile.DoesNotExist:
                return Response({'success': False, 'message': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            tips = DoctorTip.objects.filter(is_published=True).select_related('doctor__user')

        serializer = DoctorTipSerializer(tips, many=True)
        return Response({'success': True, 'tips': serializer.data})

    def post(self, request):
        # Only authenticated doctors may create tips
        try:
            if not request.user.is_authenticated or getattr(request.user, 'role', None) != 'doctor':
                return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            try:
                doctor_profile = DoctorProfile.objects.get(user=request.user)
            except DoctorProfile.DoesNotExist:
                return Response({'success': False, 'message': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = DoctorTipCreateSerializer(data=request.data, context={'doctor': doctor_profile})
            if serializer.is_valid():
                tip = serializer.save()
                return Response({'success': True, 'tip': DoctorTipSerializer(tip).data}, status=status.HTTP_201_CREATED)

            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Catch unexpected server errors and return JSON so the frontend
            # doesn't try to parse an HTML error page. Log the exception.
            logger.exception("Unhandled error creating DoctorTip")
            # For debugging (local/dev), include the exception message when DEBUG is on.
            resp = {'success': False, 'message': 'Internal server error while creating tip'}
            if getattr(settings, 'DEBUG', False):
                try:
                    resp['error'] = str(e)
                except Exception:
                    resp['error'] = 'Error serializing exception'
            return Response(resp, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorTipDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return DoctorTip.objects.select_related('doctor__user').get(pk=pk)
        except DoctorTip.DoesNotExist:
            return None

    def get(self, request, pk):
        tip = self.get_object(pk)
        if not tip or (not tip.is_published and (not request.user.is_authenticated or request.user.role != 'doctor' or tip.doctor.user != request.user)):
            return Response({'success': False, 'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        # Increment views for public hits
        try:
            tip.views = (tip.views or 0) + 1
            tip.save()
        except Exception:
            pass

        serializer = DoctorTipSerializer(tip)
        return Response({'success': True, 'tip': serializer.data})

    def put(self, request, pk):
        # Only author doctor may update
        tip = self.get_object(pk)
        if not tip:
            return Response({'success': False, 'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        if not request.user.is_authenticated or request.user.role != 'doctor' or tip.doctor.user != request.user:
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = DoctorTipCreateSerializer(tip, data=request.data, partial=True, context={'doctor': tip.doctor})
        if serializer.is_valid():
            updated = serializer.save()
            return Response({'success': True, 'tip': DoctorTipSerializer(updated).data})

        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        tip = self.get_object(pk)
        if not tip:
            return Response({'success': False, 'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        if not request.user.is_authenticated or request.user.role != 'doctor' or tip.doctor.user != request.user:
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        tip.delete()
        return Response({'success': True, 'message': 'Tip deleted'})


class DoctorReviewsView(APIView):
    """GET: list reviews for a doctor (public).
       POST: add a review (authenticated customers only).
    """
    permission_classes = [AllowAny]

    def get_doctor(self, doctor_id):
        try:
            return DoctorProfile.objects.get(pk=doctor_id)
        except DoctorProfile.DoesNotExist:
            return None

    def get(self, request, doctor_id):
        doctor = self.get_doctor(doctor_id)
        if not doctor:
            return Response({'success': False, 'message': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

        reviews = DoctorReview.objects.filter(doctor=doctor)
        serializer = DoctorReviewSerializer(reviews, many=True)
        return Response({'success': True, 'reviews': serializer.data})

    def post(self, request, doctor_id):
        # Only logged-in customers may post reviews
        if not request.user.is_authenticated or getattr(request.user, 'role', None) != 'customer':
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        doctor = self.get_doctor(doctor_id)
        if not doctor:
            return Response({'success': False, 'message': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DoctorReviewCreateSerializer(data=request.data)
        if serializer.is_valid():
            review = serializer.save(doctor=doctor, user=request.user)
            return Response({'success': True, 'review': DoctorReviewSerializer(review).data}, status=status.HTTP_201_CREATED)

        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)