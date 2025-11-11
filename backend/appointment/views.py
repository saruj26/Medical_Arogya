from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Appointment, Prescription
from doctor.models import DoctorProfile
from django.core.exceptions import ObjectDoesNotExist
from .serializers import AppointmentSerializer, PrescriptionSerializer, PrescriptionCreateSerializer
from decimal import Decimal
from django.db import transaction
from django.utils import timezone

class AppointmentListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        doctor_id = request.query_params.get('doctor')
        date = request.query_params.get('date')
        status_filter = request.query_params.get('status')

        if doctor_id:
            try:
                qs = Appointment.objects.filter(doctor__id=int(doctor_id))
            except Exception:
                return Response({'success': False, 'message': 'Invalid doctor id'}, status=status.HTTP_400_BAD_REQUEST)

            if date:
                qs = qs.filter(appointment_date=date)

            appointments = qs.select_related('doctor', 'patient').order_by('appointment_date', 'appointment_time')
        else:
            if request.user.role == 'customer':
                appointments = Appointment.objects.filter(patient=request.user).select_related('doctor', 'doctor__user').order_by('-appointment_date', '-appointment_time')
            elif request.user.role == 'doctor':
                appointments = Appointment.objects.filter(doctor__user=request.user).select_related('patient', 'doctor__user').order_by('-appointment_date', '-appointment_time')
            else:
                return Response({
                    'success': False,
                    'message': 'Permission denied'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Filter by status if provided
        if status_filter:
            appointments = appointments.filter(status=status_filter)
        
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
        
        data = request.data.copy()
        pm = data.get('payment_method', '')

        required = [
            'doctor',
            'appointment_date',
            'appointment_time',
            'patient_name',
            'patient_age',
            'patient_gender',
            'patient_phone',
            'consultation_fee',
        ]
        missing = [f for f in required if not data.get(f)]
        if missing:
            return Response({'success': False, 'message': 'Missing required fields', 'missing': missing}, status=status.HTTP_400_BAD_REQUEST)

        try:
            doctor_obj = DoctorProfile.objects.get(id=int(data.get('doctor')))
        except (ValueError, ObjectDoesNotExist):
            return Response({'success': False, 'message': 'Invalid or missing doctor id'}, status=status.HTTP_400_BAD_REQUEST)

        if pm == 'atm':
            data['payment_status'] = True
            import time
            data['payment_id'] = f"ATM{int(time.time())}"
            data['status'] = 'confirmed'
        elif pm == 'cash_on_arrival':
            data['payment_status'] = False
            data['payment_id'] = ''
            data['status'] = 'pending'

        serializer = AppointmentSerializer(data=data)
        if serializer.is_valid():
            appointment = serializer.save(patient=request.user, doctor=doctor_obj)
            if pm == 'atm':
                appointment.status = 'confirmed'
                appointment.save(update_fields=['status'])

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

class PrescriptionCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if request.user.role != 'doctor':
            return Response({
                'success': False,
                'message': 'Only doctors can create prescriptions'
            }, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data.copy()
        
        # Get doctor profile
        try:
            doctor_profile = DoctorProfile.objects.get(user=request.user)
        except DoctorProfile.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Doctor profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PrescriptionCreateSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Get appointment
                    appointment = serializer.validated_data['appointment']
                    
                    # Create prescription
                    prescription = serializer.save(
                        doctor=doctor_profile,
                        patient=appointment.patient
                    )
                    
                    # Update appointment status to completed
                    appointment.status = 'completed'
                    appointment.save(update_fields=['status'])
                    
                    return Response({
                        'success': True,
                        'message': 'Prescription created successfully',
                        'prescription': PrescriptionSerializer(prescription).data
                    }, status=status.HTTP_201_CREATED)
                    
            except Exception as e:
                return Response({
                    'success': False,
                    'message': f'Error creating prescription: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'success': False,
            'message': 'Failed to create prescription',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class PrescriptionDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            prescription = Prescription.objects.select_related(
                'appointment', 'doctor', 'patient', 'doctor__user'
            ).get(pk=pk)
        except Prescription.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Prescription not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check permissions
        if request.user.role == 'customer' and prescription.patient != request.user:
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'doctor' and prescription.doctor.user != request.user:
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = PrescriptionSerializer(prescription)
        return Response({
            'success': True,
            'prescription': serializer.data
        })

class AppointmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            appointment = Appointment.objects.select_related('doctor', 'patient').get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({'success': False, 'message': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role == 'customer' and appointment.patient != request.user:
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role == 'doctor' and appointment.doctor.user != request.user:
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = AppointmentSerializer(appointment)
        return Response({'success': True, 'appointment': serializer.data})

class AppointmentCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            appointment = Appointment.objects.select_related('doctor', 'patient').get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({'success': False, 'message': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != 'customer' or appointment.patient != request.user:
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        if appointment.status == 'cancelled':
            return Response({'success': False, 'message': 'Appointment already cancelled'}, status=status.HTTP_400_BAD_REQUEST)
        if appointment.status == 'completed':
            return Response({'success': False, 'message': 'Completed appointments cannot be cancelled'}, status=status.HTTP_400_BAD_REQUEST)

        consult_fee = Decimal(appointment.consultation_fee)
        company_fee = (consult_fee * Decimal('0.20')).quantize(Decimal('0.01'))
        refund_amount = (consult_fee - company_fee).quantize(Decimal('0.01'))

        with transaction.atomic():
            appointment.status = 'cancelled'
            appointment.company_fee = company_fee
            if appointment.payment_status:
                appointment.refund_amount = refund_amount
                appointment.refunded = True
                appointment.payment_status = False
            else:
                appointment.refund_amount = Decimal('0.00')
                appointment.refunded = False

            appointment.save(update_fields=['status', 'company_fee', 'refund_amount', 'refunded', 'payment_status'])

        return Response({'success': True, 'message': 'Appointment cancelled', 'company_fee': str(company_fee), 'refund_amount': str(refund_amount)})