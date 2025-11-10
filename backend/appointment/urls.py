from django.urls import path
from . import views

urlpatterns = [
    path('appointments/', views.AppointmentListView.as_view(), name='appointment-list'),
    path('appointments/create/', views.AppointmentCreateView.as_view(), name='appointment-create'),
    path('prescriptions/', views.PrescriptionListView.as_view(), name='prescription-list'),
]