from rest_framework import serializers
from .models import Appointment, Prescription
from doctor.serializers import DoctorProfileSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.specialty', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        # patient is set by the view (request.user) so mark it read-only to
        # avoid validation errors when creating appointments server-side.
        read_only_fields = (
            'appointment_id',
            'created_at',
            'updated_at',
            'patient',
        )

class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = Prescription
        fields = '__all__'