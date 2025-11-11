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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1656a4]" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!doctorProfile?.is_profile_complete && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-yellow-800 font-medium">Complete Your Profile</p>
            <p className="text-yellow-700 text-sm">
              Please complete your profile to start accepting appointments.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
                <p className="text-sm text-gray-600">Today's Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedToday}</p>
                <p className="text-sm text-gray-600">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPrescriptions}</p>
                <p className="text-sm text-gray-600">Prescriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-base font-semibold">
                  {getNextAppointmentTime()}
                </p>
                <p className="text-sm text-gray-600">Next Appointment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments for today</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {appointment.patient_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {appointment.patient_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        Age: {appointment.patient_age} •{" "}
                        {appointment.patient_gender}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {appointment.appointment_time}
                    </p>
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : appointment.status === "completed"
                          ? "secondary"
                          : "outline"
                      }
                      className="mb-2"
                    >
                      {appointment.status}
                    </Badge>
                    <div>
                      <Button
                        size="sm"
                        onClick={() => handleAddPrescription(appointment.id)}
                        disabled={appointment.status === "completed"}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Add Prescription
                      </Button>
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
