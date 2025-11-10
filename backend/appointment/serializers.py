from rest_framework import serializers
from .models import Appointment, Prescription
from doctor.serializers import DoctorProfileSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.specialty', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('appointment_id', 'created_at', 'updated_at')

class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = Prescription
        fields = '__all__'