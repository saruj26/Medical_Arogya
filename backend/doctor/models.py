from django.db import models
from core.models import User
from django.utils import timezone

# Day choices used for doctor availability
DAY_CHOICES = [
    ('monday', 'Monday'),
    ('tuesday', 'Tuesday'),
    ('wednesday', 'Wednesday'),
    ('thursday', 'Thursday'),
    ('friday', 'Friday'),
    ('saturday', 'Saturday'),
    ('sunday', 'Sunday'),
]

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    # Unique human-friendly doctor identifier like DOC001, DOC002
    doctor_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    specialty = models.CharField(max_length=100, blank=True, default='')
    experience = models.CharField(max_length=50, blank=True, default='')
    qualification = models.TextField(blank=True, default='')
    license_number = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    available_days = models.JSONField(default=list, blank=True)
    available_time_slots = models.JSONField(default=list, blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    is_profile_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.user.name} - {self.specialty}"