from django.urls import path
from . import views

urlpatterns = [
    path('appointments/', views.AppointmentListView.as_view(), name='appointment-list'),
    path('appointments/create/', views.AppointmentCreateView.as_view(), name='appointment-create'),
    path('appointments/<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    path('appointments/<int:pk>/cancel/', views.AppointmentCancelView.as_view(), name='appointment-cancel'),
    path('prescriptions/', views.PrescriptionListView.as_view(), name='prescription-list'),
    path('prescriptions/create/', views.PrescriptionCreateView.as_view(), name='prescription-create'),
    path('prescriptions/<int:pk>/', views.PrescriptionDetailView.as_view(), name='prescription-detail'),
]