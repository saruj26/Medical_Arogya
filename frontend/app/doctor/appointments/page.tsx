"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, Phone, Clock } from "lucide-react";

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

export default function DoctorAppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date === "2024-12-25"
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Today's Appointments</h2>
      <div className="grid gap-4">
        {todayAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto sm:mx-0">
                    <AvatarFallback>
                      {appointment.patient.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-base sm:text-lg">{appointment.patient}</h3>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <p>Age: {appointment.age} • Gender: {appointment.gender}</p>
                      <p className="flex items-center justify-center sm:justify-start gap-1">
                        <Phone className="w-3 h-3" />
                        {appointment.phone}
                      </p>
                      <p><strong>Reason:</strong> {appointment.reason}</p>
                      <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                  <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"} className="mb-3">
                    {appointment.status}
                  </Badge>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full bg-[#1656a4] hover:bg-[#1656a4]/90"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Add Prescription
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}