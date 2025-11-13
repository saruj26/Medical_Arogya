from django.contrib import admin
from .models import DoctorProfile, DoctorTip


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
	list_display = ('doctor_id', 'user', 'specialty', 'is_profile_complete', 'created_at')
	search_fields = ('doctor_id', 'user__email', 'user__name', 'specialty')


@admin.register(DoctorTip)
class DoctorTipAdmin(admin.ModelAdmin):
	list_display = ('title', 'doctor', 'is_published', 'views', 'created_at')
	list_filter = ('is_published', 'created_at')
	search_fields = ('title', 'body', 'doctor__user__name')
