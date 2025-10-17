
from django.urls import path
from . import views

urlpatterns = [
    path('doctors/', views.DoctorListView.as_view(), name='doctor-list'),
    path('doctors/create/', views.DoctorCreateView.as_view(), name='doctor-create'),
    path('doctor/profile/', views.DoctorProfileView.as_view(), name='doctor-profile'),
]