"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";
import { Calendar, User, FileText, Clock } from "lucide-react";
import api from "@/lib/api";

// Mock data
const mockAppointments = [
  {
    id: 1,
    patient: "John Doe",
    age: 35,
    gender: "Male",
    phone: "+91 98765 43210",
    date: "2024-12-25",
    time: "2:00 PM",
    reason: "Regular checkup",
    symptoms: "Chest pain, shortness of breath",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Jane Smith",
    age: 28,
    gender: "Female",
    phone: "+91 98765 43211",
    date: "2024-12-25",
    time: "3:00 PM",
    reason: "Follow-up consultation",
    symptoms: "Persistent cough",
    status: "confirmed",
  },
];

export default function DoctorDashboardPage() {
  const [doctorProfile, setDoctorProfile] = useState<any>(null);

  useEffect(() => {
    fetchDoctorProfile();
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

  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date === "2024-12-25"
  );

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
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
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
                <p className="text-2xl font-bold">5</p>
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
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">2:00 PM</p>
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
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {appointment.patient
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">
                      {appointment.reason}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointment.time}</p>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
