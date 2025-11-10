from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Appointment, Prescription
from doctor.models import DoctorProfile
from django.core.exceptions import ObjectDoesNotExist
from .serializers import AppointmentSerializer, PrescriptionSerializer

class AppointmentListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Allow customers to query appointments for a specific doctor (used
        # by the booking UI to fetch already-booked times). If 'doctor' is
        # provided as a query param, return appointments for that doctor
        # (optionally filtered by date). Otherwise preserve the previous
        # behavior: customers see their own appointments and doctors see
        # their appointment list.
        doctor_id = request.query_params.get('doctor')
        date = request.query_params.get('date')

        if doctor_id:
            # Return appointments for the specified doctor (publicly visible
            # to authenticated users so booking UI can check availability).
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
        # copy incoming data so we can adjust and validate fields
        data = request.data.copy()
        pm = data.get('payment_method', '')

        # basic required fields validation
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

        # resolve doctor id -> instance
        try:
            doctor_obj = DoctorProfile.objects.get(id=int(data.get('doctor')))
        except (ValueError, ObjectDoesNotExist):
            return Response({'success': False, 'message': 'Invalid or missing doctor id'}, status=status.HTTP_400_BAD_REQUEST)

        # Normalize simple payment handling for two methods:
        # - 'atm' (card/ATM) => mark payment_status True and create a payment_id
        # - 'cash_on_arrival' => leave payment_status False (pay at clinic)
        if pm == 'atm':
            data['payment_status'] = True
            # create a simple payment id stub; in production this would come from gateway
            import time

            data['payment_id'] = f"ATM{int(time.time())}"
            data['status'] = 'confirmed'
        elif pm == 'cash_on_arrival':
            data['payment_status'] = False
            data['payment_id'] = ''
            # keep appointment as pending until payment received
            data['status'] = 'pending'

        serializer = AppointmentSerializer(data=data)
        if serializer.is_valid():
            # pass related instances explicitly
            appointment = serializer.save(patient=request.user, doctor=doctor_obj)
            # ensure status set correctly on the saved instance
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