"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertCircle,
  Calendar,
  User,
  FileText,
  Clock,
  Loader2,
  Stethoscope,
  TrendingUp,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Appointment {
  id: number;
  appointment_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  symptoms: string;
  status: string;
  consultation_fee: string;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    completedToday: 0,
    totalPrescriptions: 0,
  });

  useEffect(() => {
    fetchDoctorProfile();
    fetchTodayAppointments();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api(`/api/doctor/doctor/profile/`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDoctorProfile(data.profile);
        }
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const response = await fetch(
        api(`/api/appointment/appointments/?date=${today}&status=confirmed`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAppointments(data.appointments || []);
          // Calculate stats
          const todayApps = data.appointments || [];
          const completed = todayApps.filter(
            (apt: Appointment) => apt.status === "completed"
          ).length;

          setStats({
            todayAppointments: todayApps.length,
            completedToday: completed,
            totalPrescriptions: 0, // You might want to fetch this separately
          });
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = (appointmentId: number) => {
    router.push(`/doctor/prescription/create?appointment=${appointmentId}`);
  };

  const getNextAppointmentTime = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0];

    const upcoming = appointments
      .filter(
        (apt) =>
          apt.appointment_date === today && apt.appointment_time > currentTime
      )
      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))[0];

    return upcoming ? upcoming.appointment_time : "No more appointments";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <Stethoscope className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1656a4] to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/30">
              <Sparkles className="w-4 h-4" />
              Welcome back, Doctor
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {doctorProfile?.user_name || "Doctor"}
            </h1>
            <p className="text-blue-100 text-lg">
              Ready for today's consultations
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold mb-1">{getNextAppointmentTime()}</p>
            <p className="text-blue-100 text-sm">Next Appointment</p>
          </div>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {!doctorProfile?.is_profile_complete && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-6 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">Complete Your Profile</p>
            <p className="text-amber-100 text-sm">
              Finish setting up your profile to start accepting appointments and build patient trust.
            </p>
          </div>
          <Button 
            className="bg-white text-amber-600 hover:bg-white/90 font-semibold rounded-xl"
            onClick={() => router.push("/doctor/profile")}
          >
            Complete Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</p>
                <p className="text-sm text-gray-600 font-medium">Today's Appointments</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="w-3 h-3" />
              <span>Ready for consultation</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.completedToday}</p>
                <p className="text-sm text-gray-600 font-medium">Completed Today</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
              <Zap className="w-3 h-3" />
              <span>Successful consultations</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPrescriptions}</p>
                <p className="text-sm text-gray-600 font-medium">Prescriptions</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-purple-600">
              <FileText className="w-3 h-3" />
              <span>Medical records</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-tight">
                  {getNextAppointmentTime()}
                </p>
                <p className="text-sm text-gray-600 font-medium">Next Appointment</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-orange-600">
              <Clock className="w-3 h-3" />
              <span>Upcoming schedule</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Today's Appointments
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
              {appointments.length} scheduled
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg font-medium">No appointments scheduled</p>
                <p className="text-gray-500 text-sm mt-1">All clear for today!</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-blue-100 group-hover:border-blue-200 transition-colors">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                        {appointment.patient_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-gray-900 text-lg">
                          {appointment.patient_name}
                        </p>
                        <Badge
                          variant={
                            appointment.status === "confirmed"
                              ? "default"
                              : appointment.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            appointment.status === "confirmed"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : appointment.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {appointment.reason}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Age: {appointment.patient_age}</span>
                        <span>•</span>
                        <span>{appointment.patient_gender}</span>
                        <span>•</span>
                        <span className="font-semibold text-blue-600">
                          {appointment.appointment_time}
                        </span>
                      </div>
                      {appointment.symptoms && (
                        <p className="text-sm text-gray-500">
                          Symptoms: {appointment.symptoms}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-3">
                    <Button
                      size="sm"
                      onClick={() => handleAddPrescription(appointment.id)}
                      disabled={appointment.status === "completed"}
                      className="bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Add Prescription
                    </Button>
                    <div className="text-xs text-gray-500">
                      Fee: Rs {appointment.consultation_fee}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}