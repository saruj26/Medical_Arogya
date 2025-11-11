from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, OTP, CustomerProfile
from .serializers import (
    UserSerializer,
    UserRegisterSerializer,
    UserLoginSerializer,
    ForgotPasswordSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer,
    CustomerProfileSerializer,
)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'message': 'Registration successful',
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Registration failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Login failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Generate OTP
            otp = OTP.generate_otp(email)
            
            # In a real application, send OTP via email
            # For demo purposes, we'll return it in the response
            print(f"OTP for {email}: {otp.otp_code}")  # Remove this in production
            
            return Response({
                'success': True,
                'message': 'OTP sent to your email',
                'otp': otp.otp_code  # Remove this in production - only for demo
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Failed to send OTP',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            otp_instance = serializer.validated_data['otp_instance']
            
            # Mark OTP as used
            otp_instance.mark_used()
            
            return Response({
                'success': True,
                'message': 'OTP verified successfully'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'OTP verification failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            new_password = serializer.validated_data['new_password']
            otp_instance = serializer.validated_data['otp_instance']
            
            try:
                user = User.objects.get(email=email)
                user.set_password(new_password)
                user.save()
                
                # Mark OTP as used
                otp_instance.mark_used()
                
                return Response({
                    'success': True,
                    'message': 'Password reset successfully'
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': False,
            'message': 'Password reset failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_serializer = UserSerializer(request.user)
        user_data = user_serializer.data

        # attach customer profile fields into the returned user object
        try:
            profile = CustomerProfile.objects.get(user=request.user)
            profile_data = CustomerProfileSerializer(profile).data
            # merge profile fields into user_data for backward compatibility
            user_data.update(profile_data)
        except CustomerProfile.DoesNotExist:
            # no profile yet - return user data without profile fields
            pass

        return Response({
            'success': True,
            'user': user_data
        }, status=status.HTTP_200_OK)

    def put(self, request):
        # Separate user fields and customer profile fields
        user_fields = {k: v for k, v in request.data.items() if k in ('name', 'phone')}
        profile_fields = {k: v for k, v in request.data.items() if k in ('date_of_birth', 'gender', 'blood_group', 'address')}
        user_serializer = UserSerializer(request.user, data=user_fields, partial=True)
        if not user_serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Profile update failed',
                'errors': user_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        # save user fields
        user_serializer.save()

        # update or create customer profile using the serializer (validation + conversion)
        if profile_fields:
            profile, created = CustomerProfile.objects.get_or_create(user=request.user)
            # Use serializer to validate and save partial updates
            profile_serializer = CustomerProfileSerializer(profile, data=profile_fields, partial=True)
            if not profile_serializer.is_valid():
                return Response({
                    'success': False,
                    'message': 'Profile update failed',
                    'errors': profile_serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            profile_serializer.save()

        # return merged user + profile data like GET
        user_data = UserSerializer(request.user).data
        try:
            profile = CustomerProfile.objects.get(user=request.user)
            profile_data = CustomerProfileSerializer(profile).data
            user_data.update(profile_data)
        except CustomerProfile.DoesNotExist:
            pass

        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': user_data
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'success': True,
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Logout failed'
            }, status=status.HTTP_400_BAD_REQUEST)