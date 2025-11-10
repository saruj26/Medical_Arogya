"use client";

import { useState, useEffect, useMemo } from "react";
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
import CalendarGrid from "@/components/booking/calendar";

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
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"atm" | "cash_on_arrival">(
    "atm"
  );
  const [lastPaymentMethod, setLastPaymentMethod] = useState<string>("");
  const [lastPaymentStatus, setLastPaymentStatus] = useState<boolean | null>(
    null
  );
  const [showCardForm, setShowCardForm] = useState(false);
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
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

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [currentSlots, setCurrentSlots] = useState<string[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    fetchDoctor(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  // Prefill patient name from logged-in user (stored at login)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw as string);
        if (u && u.name) {
          setBookingData((prev) => ({ ...prev, patient_name: u.name }));
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // --- Helpers (clean, reusable) ---
  const normalizeDay = (day: string) => day.trim().toLowerCase();

  const getUpcomingDatesForDoctor = (
    days: string[] | undefined,
    count = 14
  ) => {
    if (!days || days.length === 0) return [];
    const wanted = new Set(days.map((d) => normalizeDay(d)));
    const out: string[] = [];
    const today = new Date();
    for (let i = 0; out.length < count && i < 60; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      const weekday = dt
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      if (wanted.has(weekday)) out.push(dt.toISOString().slice(0, 10));
    }
    return out;
  };

  const startFromRange = (slotLabel: string) => slotLabel.split("-")[0].trim();

  const time24ToAmPm = (time24: string) => {
    const [hms] = time24.split(".");
    const [h, m] = hms.split(":");
    let hour = parseInt(h, 10);
    const minute = m || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour}:${minute.padStart(2, "0")} ${ampm}`;
  };

  const ampmToTime24 = (ampm: string) => {
    // convert "9:00 AM" -> "09:00:00"
    const [time, period] = ampm.split(" ");
    const [h, m] = time.split(":");
    let hour = parseInt(h, 10);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${String(m || "00").padStart(
      2,
      "0"
    )}:00`;
  };

  // --- Card helpers ---
  const detectCardType = (digits: string) => {
    if (!digits)
      return {
        type: "unknown",
        maxLength: 16,
        groups: [4, 4, 4, 4],
        cvvLength: 3,
      };
    if (/^3[47]/.test(digits))
      return { type: "amex", maxLength: 15, groups: [4, 6, 5], cvvLength: 4 };
    if (/^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]|720))/.test(digits))
      return {
        type: "mastercard",
        maxLength: 16,
        groups: [4, 4, 4, 4],
        cvvLength: 3,
      };
    if (/^4/.test(digits))
      return {
        type: "visa",
        maxLength: 16,
        groups: [4, 4, 4, 4],
        cvvLength: 3,
      };
    if (/^(6011|65|64[4-9])/.test(digits))
      return {
        type: "discover",
        maxLength: 16,
        groups: [4, 4, 4, 4],
        cvvLength: 3,
      };
    return {
      type: "unknown",
      maxLength: 16,
      groups: [4, 4, 4, 4],
      cvvLength: 3,
    };
  };

  const formatCardNumber = (digits: string, groups: number[]) => {
    const parts: string[] = [];
    let i = 0;
    for (const g of groups) {
      if (i >= digits.length) break;
      parts.push(digits.slice(i, i + g));
      i += g;
    }
    if (i < digits.length) parts.push(digits.slice(i));
    return parts.join(" ");
  };

  const luhnCheck = (n: string) => {
    let sum = 0;
    let double = false;
    for (let i = n.length - 1; i >= 0; i--) {
      let d = parseInt(n.charAt(i), 10);
      if (isNaN(d)) return false;
      if (double) {
        d = d * 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      double = !double;
    }
    return sum % 10 === 0;
  };

  const handleCardNumberChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const info = detectCardType(digits);
    const limited = digits.slice(0, info.maxLength);
    const formatted = formatCardNumber(limited, info.groups);
    setCard((c) => ({ ...c, number: formatted }));
    // adjust CVV length if needed
    if (card.cvv && card.cvv.length > info.cvvLength) {
      setCard((c) => ({ ...c, cvv: c.cvv.slice(0, info.cvvLength) }));
    }
  };

  const handleExpiryChange = (raw: string) => {
    // allow only digits and slash, auto-insert slash after 2 digits
    const digits = raw.replace(/[^0-9]/g, "");
    let out = digits;
    if (digits.length > 2) out = digits.slice(0, 2) + "/" + digits.slice(2, 4);
    setCard((c) => ({ ...c, expiry: out }));
  };

  const handleCvvChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const info = detectCardType(card.number.replace(/\s+/g, ""));
    setCard((c) => ({ ...c, cvv: digits.slice(0, info.cvvLength) }));
  };

  // --- Data fetching ---
  const fetchDoctor = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch(api(`/api/doctor/doctors/`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        const found = data.doctors?.find(
          (d: Doctor) => d.id === parseInt(params.id as string)
        );
        setDoctor(found || null);
        if (found)
          setAvailableDates(
            getUpcomingDatesForDoctor(found.available_days, 14)
          );
      }
    } catch (e) {
      console.error("Error fetching doctor", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlotsForDate = async (dateISO: string) => {
    if (!doctor) return [] as string[];
    const token = localStorage.getItem("token");
    try {
      const q = new URLSearchParams({
        doctor: String(doctor.id),
        date: dateISO,
      });
      const r = await fetch(
        api(`/api/appointment/appointments/?${q.toString()}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!r.ok) return [];
      const json = await r.json();
      return (json.appointments || []).map((a: any) =>
        time24ToAmPm(a.appointment_time)
      );
    } catch (e) {
      console.error("Failed to fetch booked slots", e);
      return [];
    }
  };

  // derive baseSlots from doctor profile
  const baseSlots = useMemo(
    () => (doctor?.available_time_slots || []).map(startFromRange),
    [doctor]
  );

  // recompute available slots for a selected date
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!doctor || !selectedDate) {
        setCurrentSlots([]);
        return;
      }
      const booked = await fetchBookedSlotsForDate(selectedDate);
      const bookedSet = new Set(booked);
      const filtered = baseSlots.filter((t) => !bookedSet.has(t));
      if (mounted) {
        setCurrentSlots(filtered);
        setSelectedTime("");
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [doctor, selectedDate, baseSlots]);

  const handleAppointmentBooking = async (method: string) => {
    const token = localStorage.getItem("token");
    if (!token || !doctor) return;
    setBookingError(null);
    setPaymentProcessing(true);
    try {
      const appointmentData: any = {
        doctor: doctor.id,
        appointment_date: selectedDate,
        appointment_time: ampmToTime24(selectedTime),
        reason: bookingData.reason,
        symptoms: bookingData.symptoms,
        patient_name: bookingData.patient_name,
        patient_age: parseInt(String(bookingData.patient_age)) || 0,
        patient_gender: bookingData.patient_gender,
        patient_phone: bookingData.patient_phone,
        emergency_contact: bookingData.emergency_contact,
        consultation_fee: doctor.consultation_fee,
        payment_method: method,
        // payment_status will be set by backend for 'atm' or left false for cash
      };

      const res = await fetch(api(`/api/appointment/appointments/create/`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (res.ok) {
        const json = await res.json();
        const appt = json.appointment || {};
        const paid = !!appt.payment_status;
        setPaymentProcessing(false);
        setLastPaymentMethod(method);
        setLastPaymentStatus(paid);
        setStep(4);
        setTimeout(() => router.push("/customer"), 3000);
      } else {
        const err = await res.json().catch(() => null);
        console.error("Booking failed", err);
        // show user-friendly message
        let msg = "Failed to book appointment";
        if (err) {
          if (err.message) msg = err.message;
          else if (err.errors) {
            try {
              const parts: string[] = [];
              for (const k of Object.keys(err.errors)) {
                parts.push(`${k}: ${JSON.stringify(err.errors[k])}`);
              }
              msg = parts.join("; ");
            } catch (e) {
              // ignore
            }
          }
        }
        setBookingError(msg);
        setPaymentProcessing(false);
      }
    } catch (e) {
      console.error("Error booking appointment:", e);
      setPaymentProcessing(false);
    }
  };

  // currentSlots is maintained by effect above; fallback to empty
  // (already defined in state)

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
                    <div className="mt-3">
                      {!selectedDate && (
                        <p className="text-sm text-gray-600 mb-2">
                          Please select a date on the calendar to view available
                          time slots.
                        </p>
                      )}

                      <CalendarGrid
                        dates={availableDates}
                        selectedDate={selectedDate}
                        onSelectDate={(d) => {
                          setSelectedDate(d);
                          setSelectedTime("");
                        }}
                      />
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <Label className="text-base font-semibold text-gray-700">
                        Available Time Slots
                      </Label>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {currentSlots.length === 0 && (
                          <div className="col-span-2 text-sm text-gray-600">
                            No available slots for this date.
                          </div>
                        )}
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
                      {bookingError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded">
                          {bookingError}
                        </div>
                      )}
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

                        {/* ATM / Card payment - show card gateway form when clicked */}
                        <Button
                          className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-lg font-semibold shadow-lg"
                          onClick={() => setShowCardForm(true)}
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay by ATM/Card ₹{doctor.consultation_fee}
                        </Button>
                      </div>

                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          className="w-full h-12 border-2 border-dashed border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() =>
                            handleAppointmentBooking("cash_on_arrival")
                          }
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Cash on Arrival (Pay at clinic)
                        </Button>
                      </div>

                      {showCardForm && (
                        <div className="mt-4 p-4 border rounded-lg bg-white">
                          <h4 className="font-semibold mb-2">
                            Enter Card Details
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Label className="text-sm">Card Number</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  value={card.number}
                                  onChange={(e) =>
                                    handleCardNumberChange(e.target.value)
                                  }
                                  placeholder="4242 4242 4242 4242"
                                  className="mt-2 h-12 border-2"
                                />
                                <div className="text-sm text-gray-600 px-2 py-1 rounded border bg-gray-50 mt-2">
                                  {(() => {
                                    const info = detectCardType(
                                      card.number.replace(/\s+/g, "")
                                    );
                                    return info.type === "unknown"
                                      ? "Card"
                                      : info.type.toUpperCase();
                                  })()}
                                </div>
                              </div>
                              {cardErrors.number && (
                                <p className="text-xs text-red-600 mt-1">
                                  {cardErrors.number}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label className="text-sm">Name on Card</Label>
                              <Input
                                value={card.name}
                                onChange={(e) =>
                                  setCard({ ...card, name: e.target.value })
                                }
                                placeholder="Full name as on card"
                                className="mt-2 h-12 border-2"
                              />
                              {cardErrors.name && (
                                <p className="text-xs text-red-600 mt-1">
                                  {cardErrors.name}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm">
                                  Expiry (MM/YY)
                                </Label>
                                <Input
                                  value={card.expiry}
                                  onChange={(e) =>
                                    handleExpiryChange(e.target.value)
                                  }
                                  placeholder="MM/YY"
                                  className="mt-2 h-12 border-2"
                                  inputMode="numeric"
                                  maxLength={5}
                                />
                                {cardErrors.expiry && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {cardErrors.expiry}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label className="text-sm">CVV</Label>
                                <Input
                                  value={card.cvv}
                                  onChange={(e) =>
                                    handleCvvChange(e.target.value)
                                  }
                                  placeholder="123"
                                  className="mt-2 h-12 border-2"
                                  inputMode="numeric"
                                  maxLength={4}
                                />
                                {cardErrors.cvv && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {cardErrors.cvv}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                onClick={() => setShowCardForm(false)}
                                className="flex-1 h-12"
                              >
                                Cancel
                              </Button>
                              <Button
                                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-lg font-semibold"
                                onClick={async () => {
                                  const errs: any = {
                                    number: "",
                                    name: "",
                                    expiry: "",
                                    cvv: "",
                                  };
                                  const num = card.number.replace(/\s+/g, "");
                                  const luhn = (n: string) => {
                                    let sum = 0;
                                    let shouldDouble = false;
                                    for (let i = n.length - 1; i >= 0; i--) {
                                      let digit = parseInt(n.charAt(i), 10);
                                      if (isNaN(digit)) return false;
                                      if (shouldDouble) {
                                        digit = digit * 2;
                                        if (digit > 9) digit -= 9;
                                      }
                                      sum += digit;
                                      shouldDouble = !shouldDouble;
                                    }
                                    return sum % 10 === 0;
                                  };

                                  if (!num || num.length < 12 || !luhn(num))
                                    errs.number = "Enter a valid card number";
                                  if (!card.name || card.name.trim().length < 2)
                                    errs.name = "Enter name on card";
                                  const m = card.expiry.match(
                                    /^(0[1-9]|1[0-2])\/(\d{2})$/
                                  );
                                  if (!m) errs.expiry = "Expiry must be MM/YY";
                                  else {
                                    const mm = parseInt(m[1], 10);
                                    const yy = parseInt(m[2], 10) + 2000;
                                    const exp = new Date(yy, mm - 1, 1);
                                    const now = new Date();
                                    exp.setMonth(exp.getMonth() + 1);
                                    exp.setDate(0);
                                    if (exp < now)
                                      errs.expiry =
                                        "Card expiry must be in the future";
                                  }
                                  if (!/^[0-9]{3,4}$/.test(card.cvv))
                                    errs.cvv = "Enter a valid CVV";

                                  setCardErrors(errs);
                                  const hasErr = Object.values(errs).some(
                                    (v) => !!v
                                  );
                                  if (hasErr) {
                                    // Do not fallback automatically - show validation errors and stop submission.
                                    setBookingError(
                                      "Please correct the highlighted card fields before proceeding."
                                    );
                                    return;
                                  }

                                  await handleAppointmentBooking("atm");
                                }}
                              >
                                Confirm & Pay ₹{doctor.consultation_fee}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
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
                  {lastPaymentStatus
                    ? "Payment Successful!"
                    : "Booking Confirmed!"}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {lastPaymentStatus ? (
                    <>
                      Your appointment has been confirmed and payment of ₹
                      {doctor.consultation_fee} has been processed.
                    </>
                  ) : (
                    <>
                      Your appointment has been confirmed. Please pay ₹
                      {doctor.consultation_fee} at the clinic (Cash on Arrival).
                    </>
                  )}
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
