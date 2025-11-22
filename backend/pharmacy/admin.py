from django.contrib import admin
from .models import MedicineCategory, Medicine, Sale, SaleItem


@admin.register(MedicineCategory)
class MedicineCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'created_at')
    search_fields = ('name',)


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'brand', 'category', 'price', 'stock_count', 'created_at')
    list_filter = ('category', 'brand')
    search_fields = ('name', 'brand')
    readonly_fields = ('created_at', 'updated_at')


class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'payment_method', 'total', 'created_by', 'created_at')
    inlines = [SaleItemInline]
    readonly_fields = ('created_at',)
