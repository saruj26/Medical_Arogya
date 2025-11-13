"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import CalendarGrid from "@/components/booking/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ArrowLeft,
  Edit,
  Check,
  X,
  Calendar,
  Clock,
  User,
  Phone,
  CreditCard,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import api from "@/lib/api";

export default function AppointmentDetail() {
  const router = useRouter();
  const [appointment, setAppointment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editReason, setEditReason] = useState("");
  const [doctor, setDoctor] = useState<any | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [baseSlots, setBaseSlots] = useState<string[]>([]);
  const [currentSlots, setCurrentSlots] = useState<string[]>([]);

  // Extract id from the URL
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const parts = path.split("/").filter(Boolean);
  const id = parts[parts.length - 1];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    if (id) fetchAppointment(token, id);
  }, [id, router]);

  const fetchAppointment = async (token: string, id: string) => {
    try {
      setLoading(true);
      const res = await fetch(api(`/api/appointment/appointments/${id}/`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        router.push("/");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setAppointment(data.appointment);
        // Initialize edit fields
        if (data.appointment) {
          const appt = data.appointment;
          try {
            setEditDate(
              appt.appointment_date
                ? new Date(appt.appointment_date).toISOString().split("T")[0]
                : ""
            );
          } catch (e) {
            setEditDate(appt.appointment_date || "");
          }
          setEditTime(
            appt.appointment_time ? time24ToAmPm(appt.appointment_time) : ""
          );
          setEditReason(appt.reason || "");
        }
      } else {
        const err = await res.json();
        console.error("Failed to fetch appointment:", err);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helpers copied from booking page to compute available dates/slots
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
    if (!ampm) return "";
    const parts = ampm.trim().split(" ");
    if (parts.length < 2) return ampm; // already in 24h-ish format
    const time = parts[0];
    const modifier = parts[1].toUpperCase();
    const [hStr, mStr] = time.split(":");
    let hours = parseInt(hStr, 10);
    const minutes = parseInt(mStr || "0", 10);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:00`;
  };

  // Fetch doctor profile to get available_days and available_time_slots
  const fetchDoctorInfo = async (doctorId: number | string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(api(`/api/doctor/doctors/`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      const found = (json.doctors || []).find(
        (d: any) => d.id === Number(doctorId)
      );
      if (!found) return;
      setDoctor(found);
      setAvailableDates(getUpcomingDatesForDoctor(found.available_days, 14));
      setBaseSlots((found.available_time_slots || []).map(startFromRange));
    } catch (e) {
      console.error("Failed to fetch doctor info", e);
    }
  };

  // fetch booked slots for a given date, excluding the current appointment id
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!r.ok) return [];
      const json = await r.json();
      return (json.appointments || [])
        .filter((a: any) => a.id !== appointment?.id)
        .map((a: any) => time24ToAmPm(a.appointment_time));
    } catch (e) {
      console.error("Failed to fetch booked slots", e);
      return [];
    }
  };

  // When appointment loaded, fetch doctor info
  useEffect(() => {
    if (appointment && appointment.doctor) fetchDoctorInfo(appointment.doctor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment]);

  // recompute available slots for selected editDate
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!doctor || !editDate) {
        setCurrentSlots([]);
        return;
      }
      const booked = await fetchBookedSlotsForDate(editDate);
      const bookedSet = new Set(booked);
      const filtered = baseSlots.filter((t) => !bookedSet.has(t));
      if (mounted) {
        // ensure current appointment time remains selectable if user doesn't change it
        if (appointment && appointment.appointment_date === editDate) {
          const currentAmPm = appointment.appointment_time
            ? time24ToAmPm(appointment.appointment_time)
            : null;
          if (currentAmPm && !filtered.includes(currentAmPm)) {
            // allow current slot by prepending it
            setCurrentSlots([currentAmPm, ...filtered]);
            return;
          }
        }
        setCurrentSlots(filtered);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [doctor, editDate, baseSlots, appointment]);

  const handleCancel = async () => {
    if (!appointment) return;

    const result = await Swal.fire({
      title: "Cancel Appointment?",
      html: `
        <div class="text-left">
          <p class="mb-4">Are you sure you want to cancel this appointment?</p>
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p class="text-amber-800 text-sm font-medium">
              <span class="font-bold">Important:</span> A 20% cancellation fee will be retained by the company.
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-sm text-gray-600">Consultation Fee: <span class="font-semibold">Rs ${
              appointment.consultation_fee
            }</span></p>
            <p class="text-sm text-gray-600">Cancellation Fee: <span class="font-semibold">Rs ${Math.round(
              appointment.consultation_fee * 0.2
            )}</span></p>
            <p class="text-sm text-gray-600">Refund Amount: <span class="font-semibold text-green-600">Rs ${Math.round(
              appointment.consultation_fee * 0.8
            )}</span></p>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel Appointment",
      cancelButtonText: "Keep Appointment",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch(
        api(`/api/appointment/appointments/${appointment.id}/cancel/`),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        await Swal.fire({
          title: "Appointment Cancelled",
          html: `
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div class="space-y-2">
                <p class="text-gray-700">Your appointment has been successfully cancelled.</p>
                <div class="bg-gray-50 rounded-lg p-3 inline-block">
                  <p class="text-sm text-gray-600">Company Fee: <span class="font-semibold">Rs ${data.company_fee}</span></p>
                  <p class="text-sm text-gray-600">Refund Amount: <span class="font-semibold text-green-600">Rs ${data.refund_amount}</span></p>
                </div>
              </div>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#16a34a",
          customClass: {
            popup: "rounded-xl",
          },
        });
        router.push("/customer");
      } else {
        await Swal.fire({
          title: "Cancellation Failed",
          text: data.message || "Failed to cancel appointment",
          icon: "error",
          confirmButtonColor: "#dc2626",
          customClass: {
            popup: "rounded-xl",
          },
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error",
        text: "Failed to cancel appointment",
        icon: "error",
        confirmButtonColor: "#dc2626",
        customClass: {
          popup: "rounded-xl",
        },
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleEditToggle = () => {
    if (!editMode && appointment) {
      // Re-sync edits from appointment
      try {
        setEditDate(
          appointment.appointment_date
            ? new Date(appointment.appointment_date).toISOString().split("T")[0]
            : ""
        );
      } catch (e) {
        setEditDate(appointment.appointment_date || "");
      }
      setEditTime(
        appointment.appointment_time
          ? time24ToAmPm(appointment.appointment_time)
          : ""
      );
      setEditReason(appointment.reason || "");
    }
    setEditMode(!editMode);
  };

  const canEditDate = () => {
    if (!appointment?.appointment_date) return false;
    const appointmentDate = new Date(appointment.appointment_date);
    const today = new Date();
    const timeDiff = appointmentDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 1;
  };

  const handleSave = async () => {
    if (!appointment) return;
    const token = localStorage.getItem("token");
    if (!token) return router.push("/");

    // Basic validation
    if (!editDate || !editTime) {
      Swal.fire({
        title: "Validation Required",
        text: "Please provide both date and time for your appointment.",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        customClass: {
          popup: "rounded-xl",
        },
      });
      return;
    }

    try {
      setSaving(true);
      // ensure appointment_time is in backend-expected 24h format (HH:MM:SS)
      let appointmentTimeForApi = editTime;
      if (/\b(AM|PM)\b/i.test(editTime)) {
        appointmentTimeForApi = ampmToTime24(editTime);
      } else if (editTime.split(":").length === 2) {
        appointmentTimeForApi = `${editTime}:00`;
      }

      const payload = {
        appointment_date: editDate,
        appointment_time: appointmentTimeForApi,
        reason: editReason,
      };

      const res = await fetch(
        api(`/api/appointment/appointments/${appointment.id}/`),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setAppointment(data.appointment || { ...appointment, ...payload });
        setEditMode(false);
        await Swal.fire({
          title: "Changes Saved",
          text: "Appointment updated successfully.",
          icon: "success",
          confirmButtonColor: "#16a34a",
          customClass: {
            popup: "rounded-xl",
          },
        });
      } else {
        await Swal.fire({
          title: "Update Failed",
          text: data.message || "Failed to update appointment",
          icon: "error",
          confirmButtonColor: "#dc2626",
          customClass: {
            popup: "rounded-xl",
          },
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error",
        text: "Failed to update appointment",
        icon: "error",
        confirmButtonColor: "#dc2626",
        customClass: {
          popup: "rounded-xl",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#1656a4] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading appointment details...
          </p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-700 font-medium text-lg mb-2">
            Appointment Not Found
          </p>
          <p className="text-gray-500 mb-6">
            The appointment you're looking for doesn't exist or you don't have
            access.
          </p>
          <Button
            onClick={() => router.push("/customer")}
            className="bg-[#1656a4] hover:bg-[#134a8a]"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 border-gray-300 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Appointment Details
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your medical appointment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* header right area now reserved for other actions or info */}
          </div>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1e78de] text-white pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Dr. {appointment.doctor_name}
                </CardTitle>
                <p className="text-blue-100 opacity-90">
                  {appointment.doctor_specialty}
                </p>
              </div>
              <Badge
                className={`${getStatusColor(
                  appointment.status
                )} text-sm font-semibold px-3 py-1 border-0 capitalize w-fit`}
              >
                {appointment.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Appointment Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#1656a4]" />
                    Appointment Information
                  </h3>

                  <div className="space-y-4">
                    {editMode ? (
                      <>
                        <div className="space-y-2">
                          <Label
                            htmlFor="date"
                            className="text-sm font-medium text-gray-700"
                          >
                            Appointment Date
                          </Label>
                          {canEditDate() ? (
                            // show a calendar grid that highlights only the doctor's available dates
                            availableDates && availableDates.length > 0 ? (
                              <CalendarGrid
                                dates={availableDates}
                                selectedDate={editDate}
                                onSelectDate={(d) => setEditDate(d)}
                                maxCols={7}
                              />
                            ) : (
                              <Input
                                id="date"
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="border-gray-300 focus:border-[#1656a4] focus:ring-[#1656a4]"
                                min={new Date().toISOString().split("T")[0]}
                              />
                            )
                          ) : (
                            <div className="space-y-2">
                              <Input
                                id="date"
                                type="date"
                                value={editDate}
                                disabled
                                className="border-gray-300 bg-gray-50"
                              />
                              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
                                Date cannot be changed as the appointment is
                                within 24 hours.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="time"
                            className="text-sm font-medium text-gray-700"
                          >
                            Appointment Time
                          </Label>

                          {/* show available slots for selected date */}
                          {!doctor ? (
                            <p className="text-sm text-gray-600">
                              Loading availability...
                            </p>
                          ) : !editDate ? (
                            <p className="text-sm text-gray-600">
                              Select a date to see available time slots.
                            </p>
                          ) : (
                            <div>
                              {currentSlots.length === 0 ? (
                                <p className="text-sm text-gray-600">
                                  No available slots for this date.
                                </p>
                              ) : (
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                  {currentSlots.map((time) => (
                                    <Button
                                      key={time}
                                      variant={
                                        editTime === time
                                          ? "default"
                                          : "outline"
                                      }
                                      className={`h-10 text-sm ${
                                        editTime === time
                                          ? "bg-[#1656a4] text-white"
                                          : "border-2 hover:border-[#1656a4] hover:bg-[#1656a4]/5"
                                      }`}
                                      onClick={() => setEditTime(time)}
                                    >
                                      <Clock className="w-4 h-4 mr-2 inline-block" />
                                      {time}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="reason"
                            className="text-sm font-medium text-gray-700"
                          >
                            Reason for Visit
                          </Label>
                          <Textarea
                            id="reason"
                            value={editReason}
                            onChange={(e) => setEditReason(e.target.value)}
                            placeholder="Describe your symptoms or reason for appointment..."
                            className="border-gray-300 focus:border-[#1656a4] focus:ring-[#1656a4] min-h-[100px] resize-vertical"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Appointment Date
                            </p>
                            <p className="text-gray-700">
                              {new Date(
                                appointment.appointment_date
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Appointment Time
                            </p>
                            <p className="text-gray-700">
                              {appointment.appointment_time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0">
                            📋
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Reason for Visit
                            </p>
                            <p className="text-gray-700">
                              {appointment.reason || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Patient & Payment Info */}
              <div className="space-y-6">
                {/* Patient Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1656a4]" />
                    Patient Information
                  </h3>

                  <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-lg">
                        {appointment.patient_name}
                      </p>
                      <p className="text-gray-600">
                        Age: {appointment.patient_age} •{" "}
                        {appointment.patient_gender}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.patient_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#1656a4]" />
                    Payment Details
                  </h3>

                  <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-semibold text-gray-900">
                        Rs {appointment.consultation_fee}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {appointment.payment_method || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Status</span>
                      <Badge
                        className={`
                          ${
                            appointment.payment_status
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          } font-medium
                        `}
                      >
                        {appointment.payment_status ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {appointment.status !== "cancelled" && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                      {!editMode && !canEditDate() && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-amber-800 text-sm text-center">
                            Appointment date cannot be changed within 24 hours
                            of the scheduled time.
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3 items-center">
                        {/* Edit / Save area */}
                        {!editMode ? (
                          <div className="flex-shrink-0">
                            <Button
                              variant="outline"
                              onClick={handleEditToggle}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                              disabled={!canEditDate()}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSave}
                              disabled={saving}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4" />
                              {saving ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={handleEditToggle}
                              className="text-gray-600"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </Button>
                          </div>
                        )}

                        {/* Cancel Appointment */}
                        <div className="flex-1">
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 font-medium"
                            onClick={handleCancel}
                            disabled={processing}
                            size="lg"
                          >
                            {processing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Cancelling Appointment...
                              </>
                            ) : (
                              "Cancel Appointment"
                            )}
                          </Button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 text-center">
                        Cancelling may incur a fee as per our policy
                      </p>
                    </div>
                  </div>
                )}

                {appointment.status === "cancelled" && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">
                        Appointment Cancelled
                      </h4>
                      {appointment.company_fee && (
                        <p className="text-sm text-red-700">
                          Company fee retained:{" "}
                          <span className="font-semibold">
                            Rs {appointment.company_fee}
                          </span>
                        </p>
                      )}
                      {appointment.refund_amount && (
                        <p className="text-sm text-green-700">
                          Refund issued:{" "}
                          <span className="font-semibold">
                            Rs {appointment.refund_amount}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
