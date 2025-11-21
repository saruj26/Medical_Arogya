from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from .models import MedicineCategory, Medicine
from .serializers import MedicineCategorySerializer, MedicineSerializer
from .serializers import SaleSerializer
from django.utils.text import slugify
import logging
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework import serializers
from django.db import transaction

logger = logging.getLogger(__name__)


class CategoryListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = MedicineCategory.objects.all().order_by('-created_at')
        serializer = MedicineCategorySerializer(categories, many=True)
        return Response({'success': True, 'categories': serializer.data})

    def post(self, request):
        if getattr(request.user, 'role', None) != 'admin' and not getattr(request.user, 'is_staff', False):
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        name = request.data.get('name')
        if not name:
            return Response({'success': False, 'message': 'Name is required'}, status=status.HTTP_400_BAD_REQUEST)

        slug = slugify(name)
        obj, created = MedicineCategory.objects.get_or_create(name=name, defaults={'slug': slug})
        serializer = MedicineCategorySerializer(obj)
        return Response({'success': True, 'category': serializer.data}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if getattr(request.user, 'role', None) != 'admin' and not getattr(request.user, 'is_staff', False):
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        try:
            cat = MedicineCategory.objects.get(pk=pk)
        except MedicineCategory.DoesNotExist:
            return Response({'success': False, 'message': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        name = request.data.get('name')
        if name:
            cat.name = name
            cat.slug = slugify(name)
            cat.save()

        return Response({'success': True, 'category': MedicineCategorySerializer(cat).data})

    def delete(self, request, pk):
        if getattr(request.user, 'role', None) != 'admin' and not getattr(request.user, 'is_staff', False):
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        try:
            cat = MedicineCategory.objects.get(pk=pk)
            cat.delete()
            return Response({'success': True, 'message': 'Category deleted'})
        except MedicineCategory.DoesNotExist:
            return Response({'success': False, 'message': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)


class MedicineListCreateView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        qs = Medicine.objects.select_related('category').order_by('-created_at')
        serializer = MedicineSerializer(qs, many=True, context={'request': request})
        return Response({'success': True, 'medicines': serializer.data})

    def post(self, request):
        if getattr(request.user, 'role', None) != 'admin' and not getattr(request.user, 'is_staff', False):
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = MedicineSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            med = serializer.save()
            return Response({'success': True, 'medicine': MedicineSerializer(med, context={'request': request}).data}, status=status.HTTP_201_CREATED)

        logger.error('Medicine create errors: %s', serializer.errors)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class MedicineDetailView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self, pk):
        try:
            return Medicine.objects.get(pk=pk)
        except Medicine.DoesNotExist:
            return None

    def get(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'success': False, 'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'medicine': MedicineSerializer(obj, context={'request': request}).data})

    def put(self, request, pk):
        if getattr(request.user, 'role', None) != 'admin' and not getattr(request.user, 'is_staff', False):
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        obj = self.get_object(pk)
        if not obj:
            return Response({'success': False, 'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MedicineSerializer(obj, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            med = serializer.save()
            return Response({'success': True, 'medicine': MedicineSerializer(med, context={'request': request}).data})

        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if getattr(request.user, 'role', None) != 'admin' and not getattr(request.user, 'is_staff', False):
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        obj = self.get_object(pk)
        if not obj:
            return Response({'success': False, 'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response({'success': True, 'message': 'Medicine deleted'})


class SaleCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # only pharmacists or staff/admin can create sales
        role = getattr(request.user, 'role', None)
        if role not in ('pharmacist', 'admin') and not getattr(request.user, 'is_staff', False):
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = SaleSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    sale = serializer.save()
            except serializers.ValidationError as e:
                return Response({'success': False, 'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
            # re-serialize the saved instance to include calculated fields
            from .serializers import SaleSerializer as _SaleSerializer
            out = _SaleSerializer(sale, context={'request': request}).data
            return Response({'success': True, 'sale': out}, status=status.HTTP_201_CREATED)

        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
