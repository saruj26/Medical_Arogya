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
} from "lucide-react";

// Mock doctor data
const mockDoctor = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  experience: "15 years",
  rating: 4.8,
  image: "/placeholder.svg?height=100&width=100",
  fee: 500,
  availableSlots: [
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
  ],
};

export default function BookAppointment() {
  const router = useRouter();
  const params = useParams();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [bookingData, setBookingData] = useState({
    reason: "",
    symptoms: "",
    patientName: "",
    patientAge: "",
    patientGender: "",
    patientPhone: "",
    emergencyContact: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "customer") {
      router.push("/auth");
    }
  }, [router]);

  const handlePaymentSubmit = async () => {
    setPaymentProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setPaymentProcessing(false);
    setStep(4);

    setTimeout(() => {
      router.push("/customer");
    }, 3000);
  };

  const availableSlots =
    mockDoctor.availableSlots.find((slot) => slot.date === selectedDate)
      ?.slots || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/customer">
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
                      <AvatarImage
                        src={mockDoctor.image || "/placeholder.svg"}
                        alt={mockDoctor.name}
                      />
                      <AvatarFallback className="bg-[#1656a4] text-white text-lg">
                        {mockDoctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {mockDoctor.name}
                      </h3>
                      <p className="text-[#1656a4] font-semibold text-lg">
                        {mockDoctor.specialty}
                      </p>
                      <p className="text-gray-600 mb-3">
                        {mockDoctor.experience} experience
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {mockDoctor.rating}
                          </span>
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
                            ₹{mockDoctor.fee}
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
                      {mockDoctor.availableSlots.map((slot) => (
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
                        {availableSlots.map((time) => (
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
                      htmlFor="patientName"
                      className="text-base font-semibold"
                    >
                      Patient Name *
                    </Label>
                    <Input
                      id="patientName"
                      value={bookingData.patientName}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          patientName: e.target.value,
                        })
                      }
                      placeholder="Enter patient full name"
                      className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="patientAge"
                      className="text-base font-semibold"
                    >
                      Age *
                    </Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={bookingData.patientAge}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          patientAge: e.target.value,
                        })
                      }
                      placeholder="Enter age"
                      className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="patientGender"
                      className="text-base font-semibold"
                    >
                      Gender *
                    </Label>
                    <Select
                      value={bookingData.patientGender}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, patientGender: value })
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
                      htmlFor="patientPhone"
                      className="text-base font-semibold"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="patientPhone"
                      type="tel"
                      value={bookingData.patientPhone}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          patientPhone: e.target.value,
                        })
                      }
                      placeholder="+91 98765 43210"
                      className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="emergencyContact"
                    className="text-base font-semibold"
                  >
                    Emergency Contact
                  </Label>
                  <Input
                    id="emergencyContact"
                    value={bookingData.emergencyContact}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        emergencyContact: e.target.value,
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
                      !bookingData.patientName ||
                      !bookingData.patientAge ||
                      !bookingData.patientGender ||
                      !bookingData.patientPhone ||
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
                        <AvatarImage
                          src={mockDoctor.image || "/placeholder.svg"}
                          alt={mockDoctor.name}
                        />
                        <AvatarFallback className="bg-[#1656a4] text-white">
                          {mockDoctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{mockDoctor.name}</p>
                        <p className="text-sm text-gray-600">
                          {mockDoctor.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Patient:</span>
                        <span className="font-medium">
                          {bookingData.patientName}
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
                          ₹{mockDoctor.fee}
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

                      <div>
                        <Label
                          htmlFor="cardName"
                          className="text-base font-semibold"
                        >
                          Cardholder Name *
                        </Label>
                        <Input
                          id="cardName"
                          value={bookingData.cardName}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              cardName: e.target.value,
                            })
                          }
                          placeholder="Enter name on card"
                          className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="cardNumber"
                          className="text-base font-semibold"
                        >
                          Card Number *
                        </Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            value={bookingData.cardNumber}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                cardNumber: e.target.value,
                              })
                            }
                            placeholder="1234 5678 9012 3456"
                            className="mt-2 h-12 border-2 focus:border-[#1656a4] pr-12"
                          />
                          <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="expiryDate"
                            className="text-base font-semibold"
                          >
                            Expiry Date *
                          </Label>
                          <Input
                            id="expiryDate"
                            value={bookingData.expiryDate}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                expiryDate: e.target.value,
                              })
                            }
                            placeholder="MM/YY"
                            className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="cvv"
                            className="text-base font-semibold"
                          >
                            CVV *
                          </Label>
                          <Input
                            id="cvv"
                            value={bookingData.cvv}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                cvv: e.target.value,
                              })
                            }
                            placeholder="123"
                            className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                          />
                        </div>
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
                          onClick={handlePaymentSubmit}
                          disabled={
                            !bookingData.cardName ||
                            !bookingData.cardNumber ||
                            !bookingData.expiryDate ||
                            !bookingData.cvv
                          }
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay ₹{mockDoctor.fee}
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
                  {mockDoctor.fee} has been processed.
                </p>

                <div className="bg-gradient-to-r from-[#1656a4]/10 to-blue-50 p-6 rounded-xl mb-8">
                  <h3 className="font-bold text-lg mb-4 text-[#1656a4]">
                    Appointment Confirmation
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-semibold">{mockDoctor.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Specialty</p>
                      <p className="font-semibold">{mockDoctor.specialty}</p>
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
                      <p className="font-semibold">{bookingData.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="font-semibold text-green-600">
                        ₹{mockDoctor.fee}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    📧 Confirmation email sent to your registered email address
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    📱 SMS confirmation sent to {bookingData.patientPhone}
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
