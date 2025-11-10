from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Appointment, Prescription
from .serializers import AppointmentSerializer, PrescriptionSerializer

class AppointmentListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role == 'customer':
            appointments = Appointment.objects.filter(patient=request.user).select_related('doctor', 'doctor__user').order_by('-appointment_date', '-appointment_time')
        elif request.user.role == 'doctor':
            appointments = Appointment.objects.filter(doctor__user=request.user).select_related('patient', 'doctor__user').order_by('-appointment_date', '-appointment_time')
        else:
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = AppointmentSerializer(appointments, many=True)
        return Response({
            'success': True,
            'appointments': serializer.data
        })

class AppointmentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if request.user.role != 'customer':
            return Response({
                'success': False,
                'message': 'Only customers can book appointments'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save(patient=request.user)
            return Response({
                'success': True,
                'message': 'Appointment booked successfully',
                'appointment': AppointmentSerializer(appointment).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Failed to book appointment',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class PrescriptionListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role == 'customer':
            prescriptions = Prescription.objects.filter(patient=request.user).select_related('doctor', 'doctor__user', 'appointment')
        elif request.user.role == 'doctor':
            prescriptions = Prescription.objects.filter(doctor__user=request.user).select_related('patient', 'appointment')
        else:
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = PrescriptionSerializer(prescriptions, many=True)
        return Response({
            'success': True,
            'prescriptions': serializer.data
        })