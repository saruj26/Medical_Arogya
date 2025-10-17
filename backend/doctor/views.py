
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
import logging

from core.models import User
from .models import DoctorProfile
from .serializers import DoctorProfileSerializer, DoctorCreateSerializer

logger = logging.getLogger(__name__)

class DoctorListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
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
                # Mark profile as complete if all required fields are present
                required_fields = ['specialty', 'experience', 'qualification', 'bio', 'available_days', 'available_time_slots']
                if all(getattr(doctor_profile, field) for field in required_fields):
                    serializer.validated_data['is_profile_complete'] = True
                
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'profile': serializer.data
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