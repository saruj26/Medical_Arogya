"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Stethoscope,
  CreditCard,
  CheckCircle,
  Star,
  Calendar,
  Clock,
  Shield,
  Zap,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";

interface Doctor {
  id: number;
  doctor_id: string;
  user_name: string;
  specialty: string;
  experience: string;
  qualification: string;
  bio: string;
  consultation_fee: string;
  available_days: string[];
  available_time_slots: string[];
}

export default function BookAppointment() {
  const router = useRouter();
  const params = useParams();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    reason: "",
    symptoms: "",
    patient_name: "",
    patient_age: "",
    patient_gender: "",
    patient_phone: "",
    emergency_contact: "",
  });

  const availableSlots = [
    {
      date: "2024-12-25",
      slots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
    },
    {
      date: "2024-12-26",
      slots: ["9:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
    },
    {
      date: "2024-12-27",
      slots: ["10:00 AM", "2:00 PM", "3:00 PM", "5:00 PM"],
    },
  ];

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    fetchDoctor(token);
  }, [router, params.id]);

  const fetchDoctor = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(api(`/api/doctor/doctors/`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const foundDoctor = data.doctors?.find(
          (d: Doctor) => d.id === parseInt(params.id as string)
        );
        setDoctor(foundDoctor || null);
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token || !doctor) return;

    setPaymentProcessing(true);

    try {
      const appointmentData = {
        doctor: doctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason: bookingData.reason,
        symptoms: bookingData.symptoms,
        patient_name: bookingData.patient_name,
        patient_age: parseInt(bookingData.patient_age),
        patient_gender: bookingData.patient_gender,
        patient_phone: bookingData.patient_phone,
        emergency_contact: bookingData.emergency_contact,
        consultation_fee: doctor.consultation_fee,
        payment_status: true, // Simulate successful payment
      };

      const response = await fetch(
        api(`/api/appointments/appointments/create/`),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (response.ok) {
        setPaymentProcessing(false);
        setStep(4);
        setTimeout(() => {
          router.push("/customer");
        }, 3000);
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setPaymentProcessing(false);
      // Handle error appropriately
    }
  };

  const currentSlots =
    availableSlots.find((slot) => slot.date === selectedDate)?.slots || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1656a4]" />
          <p className="text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Doctor Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested doctor could not be found.
          </p>
          <Link href="/customer/browse">
            <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">
              Back to Doctors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/customer/browse">
            <Button
              variant="outline"
              size="sm"
              className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1656a4]">Arogya</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step >= stepNum
                      ? "bg-[#1656a4] text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNum ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-20 h-2 mx-3 rounded-full transition-all duration-300 ${
                      step > stepNum ? "bg-[#1656a4]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-lg font-medium text-gray-700">
              {step === 1 && "Select Date & Time"}
              {step === 2 && "Patient Details"}
              {step === 3 && "Secure Payment"}
              {step === 4 && "Confirmation"}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Doctor Info */}
              <Card className="border-2 border-[#1656a4]/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Doctor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-20 h-20 border-4 border-[#1656a4]/20">
                      <AvatarFallback className="bg-[#1656a4] text-white text-lg">
                        {doctor.user_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {doctor.user_name}
                      </h3>
                      <p className="text-[#1656a4] font-semibold text-lg">
                        {doctor.specialty}
                      </p>
                      <p className="text-gray-600 mb-3">
                        {doctor.experience} experience
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">4.8</span>
                          <span className="text-gray-500 text-sm">
                            (150+ reviews)
                          </span>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-green-800 font-medium">
                            Consultation Fee
                          </span>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{doctor.consultation_fee}
                          </span>
                        </div>
                        <p className="text-green-600 text-sm mt-1">
                          Payment required to confirm booking
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time Selection */}
              <Card className="border-2 border-[#1656a4]/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Select Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label className="text-base font-semibold text-gray-700">
                      Available Dates
                    </Label>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.date}
                          variant={
                            selectedDate === slot.date ? "default" : "outline"
                          }
                          className={`h-auto p-4 justify-start ${
                            selectedDate === slot.date
                              ? "bg-[#1656a4] hover:bg-[#1656a4]/90 shadow-lg"
                              : "border-2 hover:border-[#1656a4] hover:bg-[#1656a4]/5"
                          }`}
                          onClick={() => {
                            setSelectedDate(slot.date);
                            setSelectedTime("");
                          }}
                        >
                          <div className="text-left">
                            <div className="font-semibold">
                              {new Date(slot.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-sm opacity-80">
                              {slot.slots.length} slots available
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <Label className="text-base font-semibold text-gray-700">
                        Available Time Slots
                      </Label>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {currentSlots.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className={`h-12 ${
                              selectedTime === time
                                ? "bg-[#1656a4] hover:bg-[#1656a4]/90 shadow-lg"
                                : "border-2 hover:border-[#1656a4] hover:bg-[#1656a4]/5"
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full h-12 bg-[#1656a4] hover:bg-[#1656a4]/90 text-lg font-semibold shadow-lg"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(2)}
                  >
                    Continue to Patient Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <Card className="border-2 border-[#1656a4]/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Patient Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Please provide accurate patient details for the appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="patient_name"
                      className="text-base font-semibold"
                    >
                      Patient Name *
                    </Label>
                    <Input
                      id="patient_name"
                      value={bookingData.patient_name}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          patient_name: e.target.value,
                        })
                      }
                      placeholder="Enter patient full name"
                      className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="patient_age"
                      className="text-base font-semibold"
                    >
                      Age *
                    </Label>
                    <Input
                      id="patient_age"
                      type="number"
                      value={bookingData.patient_age}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          patient_age: e.target.value,
                        })
                      }
                      placeholder="Enter age"
                      className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="patient_gender"
                      className="text-base font-semibold"
                    >
                      Gender *
                    </Label>
                    <Select
                      value={bookingData.patient_gender}
                      onValueChange={(value) =>
                        setBookingData({
                          ...bookingData,
                          patient_gender: value,
                        })
                      }
                    >
                      <SelectTrigger className="mt-2 h-12 border-2 focus:border-[#1656a4]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="patient_phone"
                      className="text-base font-semibold"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="patient_phone"
                      type="tel"
                      value={bookingData.patient_phone}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          patient_phone: e.target.value,
                        })
                      }
                      placeholder="+91 98765 43210"
                      className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="emergency_contact"
                    className="text-base font-semibold"
                  >
                    Emergency Contact
                  </Label>
                  <Input
                    id="emergency_contact"
                    value={bookingData.emergency_contact}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        emergency_contact: e.target.value,
                      })
                    }
                    placeholder="Emergency contact number"
                    className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                  />
                </div>

                <div>
                  <Label htmlFor="reason" className="text-base font-semibold">
                    Reason for Visit *
                  </Label>
                  <Input
                    id="reason"
                    value={bookingData.reason}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, reason: e.target.value })
                    }
                    placeholder="Brief reason for consultation"
                    className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms" className="text-base font-semibold">
                    Symptoms (Optional)
                  </Label>
                  <Textarea
                    id="symptoms"
                    value={bookingData.symptoms}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        symptoms: e.target.value,
                      })
                    }
                    placeholder="Describe your symptoms in detail"
                    rows={4}
                    className="mt-2 border-2 focus:border-[#1656a4]"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-12 bg-[#1656a4] hover:bg-[#1656a4]/90 text-lg font-semibold shadow-lg"
                    onClick={() => setStep(3)}
                    disabled={
                      !bookingData.patient_name ||
                      !bookingData.patient_age ||
                      !bookingData.patient_gender ||
                      !bookingData.patient_phone ||
                      !bookingData.reason
                    }
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Booking Summary */}
              <Card className="border-2 border-[#1656a4]/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg">
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-[#1656a4] text-white">
                          {doctor.user_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{doctor.user_name}</p>
                        <p className="text-sm text-gray-600">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Patient:</span>
                        <span className="font-medium">
                          {bookingData.patient_name}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(selectedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Reason:</span>
                        <span className="font-medium">
                          {bookingData.reason}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 bg-green-50 px-3 rounded-lg border-2 border-green-200">
                        <span className="font-semibold text-green-800">
                          Total Amount:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{doctor.consultation_fee}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card className="border-2 border-[#1656a4]/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Secure Payment
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Your payment information is encrypted and secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {paymentProcessing ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 border-4 border-[#1656a4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Processing Payment...
                      </h3>
                      <p className="text-gray-600">
                        Please wait while we process your payment securely
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4 text-green-600">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">256-bit SSL Encryption</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Secure Payment Gateway
                        </span>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            Payment Security
                          </span>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>
                            • Your card details are encrypted with 256-bit SSL
                          </li>
                          <li>• We never store your payment information</li>
                          <li>
                            • Instant confirmation after successful payment
                          </li>
                        </ul>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="flex-1 h-12 border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white"
                        >
                          Back
                        </Button>
                        <Button
                          className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-lg font-semibold shadow-lg"
                          onClick={handleAppointmentBooking}
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay ₹{doctor.consultation_fee}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {step === 4 && (
            <Card className="text-center border-2 border-green-200 shadow-xl">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Payment Successful!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Your appointment has been confirmed and payment of ₹
                  {doctor.consultation_fee} has been processed.
                </p>

                <div className="bg-gradient-to-r from-[#1656a4]/10 to-blue-50 p-6 rounded-xl mb-8">
                  <h3 className="font-bold text-lg mb-4 text-[#1656a4]">
                    Appointment Confirmation
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-semibold">{doctor.user_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Specialty</p>
                      <p className="font-semibold">{doctor.specialty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">
                        {new Date(selectedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold">{selectedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Patient</p>
                      <p className="font-semibold">
                        {bookingData.patient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="font-semibold text-green-600">
                        ₹{doctor.consultation_fee}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    📧 Confirmation email sent to your registered email address
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    📱 SMS confirmation sent to {bookingData.patient_phone}
                  </p>
                </div>

                <p className="text-gray-600">
                  Redirecting to your dashboard...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
