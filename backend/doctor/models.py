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
    # Optional profile image stored under MEDIA_ROOT/doctor_images/
    profile_image = models.ImageField(upload_to='doctor_images/', null=True, blank=True)
    available_days = models.JSONField(default=list, blank=True)
    available_time_slots = models.JSONField(default=list, blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    is_profile_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.user.name} - {self.specialty}"

    def save(self, *args, **kwargs):
        """
        Normalize specialty to Title Case before saving so the backend
        stores a consistent capitalized value (e.g. "Cardiology" or
        "Internal Medicine"). This centralizes normalization and
        applies to both create and update flows.
        """
        try:
            if self.specialty and isinstance(self.specialty, str):
                # strip surrounding whitespace and convert to Title Case
                self.specialty = self.specialty.strip().title()
        except Exception:
            # if anything goes wrong, fall back to original value
            pass

        super().save(*args, **kwargs)


class DoctorTip(models.Model):
    """A short, doctor-authored tip article that customers can read.

    Stored under the doctor who authored it (DoctorProfile). Tips are intended
    to be small, helpful pieces of health advice (non-diagnostic) — the UI and
    frontend will make clear these are educational tips, not medical
    consultations.
    """
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='tips')
    title = models.CharField(max_length=200)
    body = models.TextField()
    tags = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — {self.doctor}"


class DoctorReview(models.Model):
    """Patient review for a doctor.

    Stored with a reference to the DoctorProfile and (optionally) the
    authenticated User who posted it. Rating is 1-5 (integer).
    """
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        user_label = self.user.name if self.user else 'Anonymous'
        return f"Review {self.rating} by {user_label} for {self.doctor}"