from django.db import models
from django.conf import settings


class MedicineCategory(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Medicine(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(MedicineCategory, on_delete=models.SET_NULL, null=True, related_name='medicines')
    brand = models.CharField(max_length=255, blank=True, null=True)
    weight_or_volume = models.CharField(max_length=100, blank=True, null=True)
    # Price of the medicine (in your currency) and optional discount percentage
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text='Discount percentage, e.g. 10.00 for 10%')
    stock_count = models.IntegerField(default=0)
    image = models.ImageField(upload_to='medicine_images/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.brand})" if self.brand else self.name


class Sale(models.Model):
    PAYMENT_CHOICES = (('cash', 'Cash'), ('card', 'Card'))

    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, blank=True, null=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cash')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale #{self.id} - {self.customer_name} - {self.total}"


class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Medicine, on_delete=models.SET_NULL, null=True)
    qty = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.product} x{self.qty} @ {self.price}"
