
from django.urls import path
from . import views

urlpatterns = [
    path('doctors/', views.DoctorListView.as_view(), name='doctor-list'),
    path('doctors/create/', views.DoctorCreateView.as_view(), name='doctor-create'),
    path('doctor/profile/', views.DoctorProfileView.as_view(), name='doctor-profile'),
    path('pharmacists/', views.PharmacistListView.as_view(), name='pharmacist-list'),
    path('pharmacists/create/', views.PharmacistCreateView.as_view(), name='pharmacist-create'),
    # Tips for customers
    path('tips/', views.DoctorTipsListCreateView.as_view(), name='doctor-tips-list-create'),
    path('tips/<int:pk>/', views.DoctorTipDetailView.as_view(), name='doctor-tip-detail'),
    # Reviews for a doctor (list + create)
    path('<int:doctor_id>/reviews/', views.DoctorReviewsView.as_view(), name='doctor-reviews'),
]