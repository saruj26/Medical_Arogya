from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, OTP
from doctor.models import DoctorProfile

class UserSerializer(serializers.ModelSerializer):
    is_profile_complete = serializers.SerializerMethodField(read_only=True)
    doctor_id = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'phone', 'role', 'date_joined', 'is_profile_complete', 'doctor_id')
        read_only_fields = ('id', 'date_joined', 'role', 'is_profile_complete', 'doctor_id')

    def get_is_profile_complete(self, obj):
        if obj.role == 'doctor':
            try:
                return obj.doctor_profile.is_profile_complete
            except DoctorProfile.DoesNotExist:
                return False
        return False

    def get_doctor_id(self, obj):
        if obj.role == 'doctor':
            try:
                return obj.doctor_profile.doctor_id
            except DoctorProfile.DoesNotExist:
                return None
        return None

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    # Make password_confirm optional to support frontend payloads that don't send it
    password_confirm = serializers.CharField(write_only=True, required=False)
    # Accept optional role so extra fields from frontend won't trigger errors
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'name', 'phone', 'password', 'password_confirm', 'role')

    def validate(self, attrs):
        # If password_confirm is provided, validate it matches; otherwise allow single-password flows
        pwd = attrs.get('password')
        pwd_conf = attrs.get('password_confirm')
        if pwd_conf is not None and pwd != pwd_conf:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs

    def create(self, validated_data):
        # Remove optional fields if present (frontend may not send them)
        validated_data.pop('password_confirm', None)
        validated_data.pop('role', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data.get('name', ''),
            phone=validated_data.get('phone', ''),
            password=validated_data['password']
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        return attrs

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('No user found with this email address.')
        return value

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        otp_code = attrs.get('otp')

        try:
            otp = OTP.objects.get(email=email, otp_code=otp_code, is_used=False)
            if not otp.is_valid():
                raise serializers.ValidationError('OTP has expired.')
            attrs['otp_instance'] = otp
        except OTP.DoesNotExist:
            raise serializers.ValidationError('Invalid OTP.')

        return attrs

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(min_length=6)
    confirm_password = serializers.CharField(min_length=6)
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")

        try:
            otp = OTP.objects.get(
                email=attrs['email'], 
                otp_code=attrs['otp'], 
                is_used=False
            )
            if not otp.is_valid():
                raise serializers.ValidationError('OTP has expired.')
            attrs['otp_instance'] = otp
        except OTP.DoesNotExist:
            raise serializers.ValidationError('Invalid OTP.')

        return attrs