from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListCreateView.as_view(), name='pharmacy-categories'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='pharmacy-category-detail'),
    path('products/', views.MedicineListCreateView.as_view(), name='pharmacy-products'),
    path('products/<int:pk>/', views.MedicineDetailView.as_view(), name='pharmacy-product-detail'),
]
