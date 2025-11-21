from rest_framework import serializers
from .models import MedicineCategory, Medicine
from .models import Sale, SaleItem
from django.db import transaction


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
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)

    class Meta:
        model = Medicine
        fields = (
            'id', 'name', 'category', 'category_id', 'brand', 'weight_or_volume', 'price', 'discount', 'stock_count', 'image', 'description', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class SaleItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Medicine.objects.all(), source='product', write_only=True)

    class Meta:
        model = SaleItem
        fields = ('id', 'product', 'product_id', 'qty', 'price', 'discount')
        read_only_fields = ('id', 'product', 'price', 'discount')


class SaleSerializer(serializers.ModelSerializer):
    items = serializers.ListField(child=serializers.DictField(), write_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.id')

    class Meta:
        model = Sale
        fields = ('id', 'customer_name', 'phone', 'payment_method', 'subtotal', 'tax', 'total', 'items', 'created_by', 'created_at')
        read_only_fields = ('id', 'subtotal', 'tax', 'total', 'created_by', 'created_at')

    def validate_items(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError('Items list is required')
        return value

    def create(self, validated_data):
        items = validated_data.pop('items')
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        subtotal = 0
        # calculate subtotal and prepare item records
        item_records = []
        for it in items:
            product_id = it.get('product_id') or it.get('product') or it.get('id')
            qty = int(it.get('qty', 1))
            product = None
            if isinstance(product_id, int):
                product = Medicine.objects.filter(pk=product_id).first()
            elif isinstance(product_id, Medicine):
                product = product_id
            if not product:
                raise serializers.ValidationError({'items': f'Product not found for id {product_id}'})
            price = float(product.price or 0)
            discount = float(product.discount or 0)
            discounted = price * (1 - (discount or 0) / 100)
            subtotal += discounted * qty
            item_records.append({'product': product, 'qty': qty, 'price': price, 'discount': discount})

        tax = round(subtotal * 0.05, 2)
        total = round(subtotal + tax, 2)

        with transaction.atomic():
            sale = Sale.objects.create(subtotal=subtotal, tax=tax, total=total, created_by=user, **validated_data)
            for rec in item_records:
                SaleItem.objects.create(sale=sale, product=rec['product'], qty=rec['qty'], price=rec['price'], discount=rec['discount'])
                # decrement stock if available
                try:
                    m = rec['product']
                    m.stock_count = max(0, (m.stock_count or 0) - rec['qty'])
                    m.save()
                except Exception:
                    pass

        return sale
