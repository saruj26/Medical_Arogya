"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, Phone, Clock, Loader2 } from "lucide-react";
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

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("confirmed");

  useEffect(() => {
    fetchAppointments();
  }, [selectedStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      let url = `/api/appointment/appointments/`;
      if (selectedStatus) {
        url += `?status=${selectedStatus}`;
      }

      const response = await fetch(api(url), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAppointments(data.appointments || []);
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "completed":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1656a4]" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Appointments</h2>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Appointments Found
              </h3>
              <p className="text-gray-600">
                {selectedStatus
                  ? `No ${selectedStatus} appointments found`
                  : "No appointments found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto sm:mx-0">
                      <AvatarFallback>
                        {appointment.patient_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-base sm:text-lg">
                        {appointment.patient_name}
                      </h3>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <p>
                          Age: {appointment.patient_age} • Gender:{" "}
                          {appointment.patient_gender}
                        </p>
                        <p className="flex items-center justify-center sm:justify-start gap-1">
                          <Phone className="w-3 h-3" />
                          {appointment.patient_phone}
                        </p>
                        <p>
                          <strong>Appointment ID:</strong>{" "}
                          {appointment.appointment_id}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Reason:</strong> {appointment.reason}
                        </p>
                        {appointment.symptoms && (
                          <p>
                            <strong>Symptoms:</strong> {appointment.symptoms}
                          </p>
                        )}
                        <p>
                          <strong>Fee:</strong> Rs{" "}
                          {appointment.consultation_fee}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center lg:text-right">
                    <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {appointment.appointment_time}
                      </span>
                    </div>
                    <Badge
                      variant={getStatusVariant(appointment.status)}
                      className="mb-3 capitalize"
                    >
                      {appointment.status}
                    </Badge>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full bg-[#1656a4] hover:bg-[#1656a4]/90"
                        onClick={() => handleAddPrescription(appointment.id)}
                        disabled={
                          appointment.status === "completed" ||
                          appointment.status === "cancelled"
                        }
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {appointment.status === "completed"
                          ? "Prescription Added"
                          : "Add Prescription"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
