from rest_framework import serializers
from .models import MedicineCategory, Medicine


class MedicineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineCategory
        fields = ('id', 'name', 'slug', 'created_at')
        read_only_fields = ('id', 'created_at')


class MedicineSerializer(serializers.ModelSerializer):
    category = MedicineCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=MedicineCategory.objects.all(), source='category', write_only=True, required=False
    )
    image = serializers.ImageField(required=False, allow_null=True, use_url=True)

    class Meta:
        model = Medicine
        fields = (
            'id', 'name', 'category', 'category_id', 'brand', 'weight_or_volume', 'stock_count', 'image', 'description', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
