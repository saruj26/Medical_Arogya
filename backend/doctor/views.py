
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