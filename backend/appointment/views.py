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
import datetime

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

    def put(self, request, pk):
        """
        Allow a customer to edit their appointment (date, time, reason).
        Validations:
        - Only the owning customer may update
        - Cannot update cancelled or completed appointments
        - Cannot update if appointment is within 24 hours of scheduled datetime
        - New date must be one of the doctor's available_days
        - New time must match one of the doctor's available_time_slots (start time)
        - Slot must not already be booked by another appointment
        Returns serialized appointment on success
        """
        try:
            appointment = Appointment.objects.select_related('doctor', 'patient').get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({'success': False, 'message': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

        # Only the owning customer may update
        if request.user.role != 'customer' or appointment.patient != request.user:
            return Response({'success': False, 'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        # Do not allow updates for cancelled or completed
        if appointment.status in ['cancelled', 'completed']:
            return Response({'success': False, 'message': 'Cannot modify this appointment'}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent edits within 24 hours of the scheduled appointment datetime
        try:
            appt_dt = datetime.datetime.combine(appointment.appointment_date, appointment.appointment_time)
            now = timezone.now()
            # Ensure appt_dt aware if now is aware
            if timezone.is_aware(now) and timezone.is_naive(appt_dt):
                appt_dt = timezone.make_aware(appt_dt, timezone.get_current_timezone())
            if appt_dt <= now + datetime.timedelta(hours=24):
                return Response({'success': False, 'message': 'Appointments cannot be edited within 24 hours of the scheduled time.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            # If anything goes wrong computing times, disallow the edit for safety
            return Response({'success': False, 'message': 'Unable to validate appointment timing'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data or {}
        new_date = data.get('appointment_date')
        new_time = data.get('appointment_time')
        new_reason = data.get('reason', appointment.reason)

        # Helper to parse incoming time strings into time objects
        def parse_time_str(value):
            if not value:
                return None
            if isinstance(value, datetime.time):
                return value
            # Try several common formats
            for fmt in ("%H:%M:%S", "%H:%M", "%I:%M %p", "%I:%M%p"):
                try:
                    return datetime.datetime.strptime(value, fmt).time()
                except Exception:
                    continue
            # As a last resort, try trimming seconds and parsing
            try:
                parts = value.split(':')
                if len(parts) >= 2:
                    h = int(parts[0]); m = int(parts[1])
                    return datetime.time(hour=h, minute=m)
            except Exception:
                pass
            return None

        # Determine target date and time (fall back to existing)
        target_date = appointment.appointment_date
        target_time = appointment.appointment_time

        if new_date:
            try:
                target_date = datetime.datetime.strptime(new_date, "%Y-%m-%d").date()
            except Exception:
                return Response({'success': False, 'message': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_time:
            parsed_time = parse_time_str(new_time)
            if not parsed_time:
                return Response({'success': False, 'message': 'Invalid time format.'}, status=status.HTTP_400_BAD_REQUEST)
            target_time = parsed_time

        # Validate target date is one of doctor's available_days (if doctor has availability configured)
        doctor_profile = appointment.doctor
        try:
            if doctor_profile.available_days and len(doctor_profile.available_days) > 0:
                weekday = target_date.strftime('%A').lower()
                available_days = [d.strip().lower() for d in (doctor_profile.available_days or [])]
                if weekday not in available_days:
                    return Response({'success': False, 'message': 'Doctor is not available on the selected date.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            # ignore and continue if doctor availability is malformed
            pass

        # Validate target_time is one of doctor's available_time_slots (compare start time)
        try:
            slot_ok = True
            if doctor_profile.available_time_slots and len(doctor_profile.available_time_slots) > 0:
                slot_ok = False
                for slot in doctor_profile.available_time_slots:
                    # slot may be in formats like '09:00 - 09:30' or '9:00 AM - 9:30 AM'
                    start = str(slot).split('-')[0].strip()
                    start_time = parse_time_str(start)
                    if start_time and start_time == target_time:
                        slot_ok = True
                        break
                if not slot_ok:
                    return Response({'success': False, 'message': 'Selected time is not within the doctor\'s available time slots.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            pass

        # Check for booking conflicts (another appointment at same doctor/date/time)
        conflict_qs = Appointment.objects.filter(doctor=doctor_profile, appointment_date=target_date, appointment_time=target_time).exclude(pk=appointment.pk)
        if conflict_qs.exists():
            return Response({'success': False, 'message': 'Selected time slot is already booked. Please choose another slot.'}, status=status.HTTP_409_CONFLICT)

        # Perform update
        try:
            with transaction.atomic():
                appointment.appointment_date = target_date
                appointment.appointment_time = target_time
                appointment.reason = new_reason
                appointment.save(update_fields=['appointment_date', 'appointment_time', 'reason', 'updated_at'])

            serializer = AppointmentSerializer(appointment)
            return Response({'success': True, 'message': 'Appointment updated successfully', 'appointment': serializer.data})
        except Exception as e:
            return Response({'success': False, 'message': f'Failed to update appointment: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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