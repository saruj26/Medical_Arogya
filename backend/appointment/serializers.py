from rest_framework import serializers
from .models import Appointment, Prescription
from doctor.models import DoctorProfile
from core.models import User

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.specialization', read_only=True)
    patient_email = serializers.CharField(source='patient.email', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id',
            'appointment_id',
            'patient',
            'doctor',
            'doctor_name',
            'doctor_specialty',
            'patient_email',
            'appointment_date',
            'appointment_time',
            'reason',
            'symptoms',
            'patient_name',
            'patient_age',
            'patient_gender',
            'patient_phone',
            'emergency_contact',
            'status',
            'consultation_fee',
            'payment_status',
            'payment_method',
            'payment_id',
            'company_fee',
            'refund_amount',
            'refunded',
            'created_at',
            'updated_at'
        ]
        read_only_fields = (
            'appointment_id',
            'created_at',
            'updated_at',
            'patient',
        )

class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.specialization', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    patient_email = serializers.CharField(source='patient.email', read_only=True)
    appointment_date = serializers.DateField(source='appointment.appointment_date', read_only=True)
    appointment_time = serializers.TimeField(source='appointment.appointment_time', read_only=True)
    appointment_id = serializers.CharField(source='appointment.appointment_id', read_only=True)
    
    class Meta:
        model = Prescription
        fields = [
            'id',
            'appointment',
            'appointment_id',
            'appointment_date',
            'appointment_time',
            'doctor',
            'doctor_name',
            'doctor_specialty',
            'patient',
            'patient_name',
            'patient_email',
            'medications',
            'instructions',
            'diagnosis',
            'notes',
            'follow_up_date',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')

class PrescriptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = [
            'appointment',
            'medications',
            'instructions',
            'diagnosis',
            'notes',
            'follow_up_date'
        ]
    
    def validate_medications(self, value):
        """Validate medications format"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Medications must be a list")
        
        if len(value) == 0:
            raise serializers.ValidationError("At least one medication is required")
        
        for i, med in enumerate(value):
            if not isinstance(med, dict):
                raise serializers.ValidationError(f"Medication {i+1} must be an object")
            
            if 'name' not in med or not med['name'].strip():
                raise serializers.ValidationError(f"Medication {i+1} must have a name")
            
            if 'dosage' not in med or not med['dosage'].strip():
                raise serializers.ValidationError(f"Medication {i+1} must have a dosage")
            
            if 'duration' not in med or not med['duration'].strip():
                raise serializers.ValidationError(f"Medication {i+1} must have a duration")
        
        return value
    
    def validate_appointment(self, value):
        """Validate appointment for prescription creation"""
        request = self.context.get('request')
        
        if not request:
            return value
            
        # Check if user is a doctor
        if request.user.role != 'doctor':
            raise serializers.ValidationError("Only doctors can create prescriptions")
        
        # Check if appointment belongs to the doctor
        try:
            doctor_profile = DoctorProfile.objects.get(user=request.user)
            if value.doctor != doctor_profile:
                raise serializers.ValidationError("You can only create prescriptions for your own appointments.")
        except DoctorProfile.DoesNotExist:
            raise serializers.ValidationError("Doctor profile not found")
        
        # Check if appointment status allows prescription creation
        if value.status not in ['confirmed', 'completed']:
            raise serializers.ValidationError("Prescription can only be created for confirmed or completed appointments.")
        
        # Check if prescription already exists
        if Prescription.objects.filter(appointment=value).exists():
            raise serializers.ValidationError("Prescription already exists for this appointment.")
        
        return value
    
    def validate(self, data):
        """Additional validation"""
        if not data.get('instructions') or not data['instructions'].strip():
            raise serializers.ValidationError({"instructions": "Instructions are required"})
        
        if not data.get('diagnosis') or not data['diagnosis'].strip():
            raise serializers.ValidationError({"diagnosis": "Diagnosis is required"})
        
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        doctor_profile = DoctorProfile.objects.get(user=request.user)
        
        prescription = Prescription.objects.create(
            appointment=validated_data['appointment'],
            doctor=doctor_profile,
            patient=validated_data['appointment'].patient,
            medications=validated_data['medications'],
            instructions=validated_data['instructions'],
            diagnosis=validated_data['diagnosis'],
            notes=validated_data.get('notes', ''),
            follow_up_date=validated_data.get('follow_up_date')
        )
        
        return prescription