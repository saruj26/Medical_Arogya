from rest_framework import serializers
from .models import DoctorTip, DoctorProfile


class DoctorTipSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_id = serializers.CharField(source='doctor.doctor_id', read_only=True)

    class Meta:
        model = DoctorTip
        fields = (
            'id', 'doctor', 'doctor_name', 'doctor_id', 'title', 'body', 'tags',
            'is_published', 'views', 'created_at', 'updated_at'
        )
        read_only_fields = ('doctor', 'views', 'created_at', 'updated_at')


class DoctorTipCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorTip
        fields = ('title', 'body', 'tags', 'is_published')

    def create(self, validated_data):
        # Assume view has set context['doctor'] to the DoctorProfile instance
        doctor = self.context.get('doctor')
        if not doctor:
            raise serializers.ValidationError("Doctor context is required")

        tip = DoctorTip.objects.create(doctor=doctor, **validated_data)
        return tip
