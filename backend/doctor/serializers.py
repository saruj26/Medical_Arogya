
from rest_framework import serializers
from django.db.models import Avg, Count
from core.models import User
from .models import DoctorProfile
from .models import DoctorTip, DoctorReview

class DoctorProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    profile_image = serializers.ImageField(required=False, allow_null=True, use_url=True)
    avg_rating = serializers.SerializerMethodField(read_only=True)
    review_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = (
            'id', 'doctor_id', 'user', 'user_name', 'user_email', 'user_phone',
            'profile_image',
            'specialty', 'experience', 'qualification', 'license_number', 'bio',
            'available_days', 'available_time_slots', 'consultation_fee',
            'is_profile_complete', 'created_at', 'updated_at',
            'avg_rating', 'review_count',
        )
        read_only_fields = ('user', 'created_at', 'updated_at', 'doctor_id')

    def get_avg_rating(self, obj):
        # aggregate average rating from related reviews
        agg = obj.reviews.aggregate(avg=Avg('rating'))
        avg = agg.get('avg') or 0
        try:
            return round(float(avg), 1)
        except Exception:
            return 0

    def get_review_count(self, obj):
        agg = obj.reviews.aggregate(cnt=Count('id'))
        return agg.get('cnt') or 0

class DoctorCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = DoctorProfile
        fields = ('email', 'name', 'phone', 'password')
    
    def create(self, validated_data):
        # Extract user data
        user_data = {
            'email': validated_data.pop('email'),
            'name': validated_data.pop('name'),
            'phone': validated_data.pop('phone', ''),
            'password': validated_data.pop('password'),
            'role': 'doctor'
        }
        
        # Create user
        user = User.objects.create_user(**user_data)
        
        # Create doctor profile with default empty arrays for availability
        doctor_profile = DoctorProfile.objects.create(
            user=user,
            available_days=[],
            available_time_slots=[],
            bio=''
        )

        # Generate a unique doctor_id like DOC001, DOC002
        last = DoctorProfile.objects.exclude(doctor_id__isnull=True).order_by('-id').first()
        if last and last.doctor_id and last.doctor_id.startswith('DOC'):
            try:
                num = int(last.doctor_id.replace('DOC', '')) + 1
            except Exception:
                num = DoctorProfile.objects.count()
        else:
            num = DoctorProfile.objects.count()
            num = num + 1

        doctor_id = f"DOC{num:03d}"
        doctor_profile.doctor_id = doctor_id
        doctor_profile.save()
        
        return doctor_profile


class DoctorReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = DoctorReview
        fields = ('id', 'doctor', 'user', 'user_name', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'user', 'user_name', 'created_at')


class DoctorReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorReview
        fields = ('rating', 'comment')

    def validate_rating(self, value):
        if not (1 <= int(value) <= 5):
            raise serializers.ValidationError('Rating must be between 1 and 5')
        return int(value)