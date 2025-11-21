from django.db import models
from core.models import User
from doctor.models import DoctorProfile
from django.utils import timezone
from django.conf import settings

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    appointment_id = models.CharField(max_length=20, unique=True)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='doctor_appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.TextField()
    symptoms = models.TextField(blank=True)
    patient_name = models.CharField(max_length=255)
    patient_age = models.IntegerField()
    patient_gender = models.CharField(max_length=10)
    patient_phone = models.CharField(max_length=15)
    emergency_contact = models.CharField(max_length=15, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.BooleanField(default=False)
    payment_method = models.CharField(max_length=50, blank=True, default="")
    payment_id = models.CharField(max_length=100, blank=True)
    company_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refunded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.appointment_id} - {self.patient_name}"

    def save(self, *args, **kwargs):
        if not self.appointment_id:
            last = Appointment.objects.order_by('-id').first()
            if last and last.appointment_id.startswith('APT'):
                try:
                    num = int(last.appointment_id.replace('APT', '')) + 1
                except Exception:
                    num = Appointment.objects.count() + 1
            else:
                num = Appointment.objects.count() + 1
            self.appointment_id = f"APT{num:05d}"
        super().save(*args, **kwargs)

class Prescription(models.Model):
    appointment = models.OneToOneField(
        Appointment, 
        on_delete=models.CASCADE, 
        related_name='prescription'
    )
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    medications = models.JSONField(default=list)  # Store as list of objects: [{"name": "", "dosage": "", "duration": ""}]
    instructions = models.TextField()
    diagnosis = models.TextField(blank=True)
    notes = models.TextField(blank=True)  # Additional notes from doctor
    follow_up_date = models.DateField(null=True, blank=True)  # Optional follow-up date
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Pharmacist dispensing info
    dispensed = models.BooleanField(default=False)
    dispensed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='dispensed_prescriptions')
    dispensed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Prescription for {self.patient.name} - {self.appointment.appointment_id}"

    class Meta:
        ordering = ['-created_at']