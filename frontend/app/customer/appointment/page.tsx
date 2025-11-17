// app/customer/appointments/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Loader2,
  AlertCircle,
  Clock,
  User,
  Stethoscope,
  CalendarDays,
  FileText,
  ArrowRight,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import api from "@/lib/api";

interface Appointment {
  id: number;
  appointment_id: string;
  doctor_name: string;
  doctor_specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  consultation_fee: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true);
      setFetchError(null);
      const appointmentsRes = await fetch(
        api(`/api/appointment/appointments/`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (appointmentsRes.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");
        router.push("/");
        return;
      }

      try {
        const ct = appointmentsRes.headers.get("content-type") || "";
        if (appointmentsRes.ok) {
          if (ct.includes("application/json")) {
            const appointmentsData = await appointmentsRes.json();
            setAppointments(appointmentsData.appointments || []);
          } else {
            const text = await appointmentsRes.text();
            console.error(
              "Appointments fetch returned non-JSON OK response:",
              text
            );
            setFetchError("Server returned non-JSON response");
          }
        } else {
          if (ct.includes("application/json")) {
            const errBody = await appointmentsRes.json();
            console.error(
              "Appointments fetch error:",
              appointmentsRes.status,
              errBody
            );
            setFetchError(
              errBody.message || `Server returned ${appointmentsRes.status}`
            );
          } else {
            const text = await appointmentsRes.text();
            console.error(
              "Appointments fetch error (non-JSON):",
              appointmentsRes.status,
              text
            );
            setFetchError(
              `${text.substring(0, 400)}${text.length > 400 ? "..." : ""}`
            );
          }
        }
      } catch (e) {
        console.error("Error processing appointments response", e);
        setFetchError("Failed to load appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments data:", error);
      setFetchError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <Calendar className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">
            Loading your appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    My Appointments
                  </h1>
                  <p className="text-sm text-gray-600">
                    Manage your healthcare consultations
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure & Confidential</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6">
        
        {/* Appointments List */}
        <div className="space-y-6">
          {fetchError ? (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Could Not Load Appointments
                </h3>
                <p className="text-gray-600 mb-6 text-lg">{fetchError}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() =>
                      fetchDashboardData(localStorage.getItem("token") || "")
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base"
                  >
                    Try Again
                  </Button>
                  <Link href="/customer">
                    <Button variant="outline" className="px-8 py-3 text-base">
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : appointments.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm text-center py-16">
              <CardContent>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Appointments Found
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  You haven't booked any appointments yet. Start your healthcare journey by booking your first consultation.
                </p>
                <Link href="/customer/doctors">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3 text-base font-semibold shadow-lg">
                    Find Doctors & Book Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm font-medium"
                >
                  {appointments.length} appointment
                  {appointments.length !== 1 ? "s" : ""} total
                </Badge>
                <Link href="/customer/doctors">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md">
                    + Book New Appointment
                  </Button>
                </Link>
              </div>

              {appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-white/90 backdrop-blur-sm overflow-hidden"
                  onClick={() =>
                    router.push(`/customer/appointment/${appointment.id}`)
                  }
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Doctor Information */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <User className="w-8 h-8 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                Dr. {appointment.doctor_name}
                              </h3>
                              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                <Stethoscope className="w-3 h-3" />
                                {appointment.doctor_specialty}
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {appointment.reason || "General Consultation"}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  ID: {appointment.appointment_id}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium text-gray-700">
                                  {appointment.consultation_fee} Rs
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start lg:items-end xl:items-center gap-4 lg:gap-3 xl:gap-6 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 mb-1">
                              {formatDate(appointment.appointment_date)}
                            </p>
                            <p className="text-blue-600 font-semibold text-base">
                              {appointment.appointment_time}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge
                              className={`px-3 py-1.5 border-2 font-medium capitalize ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              <span className="flex items-center gap-1.5">
                                {getStatusIcon(appointment.status)}
                                {appointment.status}
                              </span>
                            </Badge>

                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {appointments.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Link href="/customer/doctors">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3 text-base font-semibold shadow-lg">
                  Book New Appointment
                </Button>
              </Link>
              <Link href="/customer">
                <Button
                  variant="outline"
                  className="px-8 py-3 text-base font-semibold border-2"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}