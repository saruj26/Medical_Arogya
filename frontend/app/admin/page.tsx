"use client";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, DollarSign, CreditCard } from "lucide-react";

export default function AdminDashboard() {
  const [doctorsCount, setDoctorsCount] = useState(0);

  useEffect(() => {
    fetchDoctorsCount();
  }, []);

  const fetchDoctorsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api(`/api/doctor/doctors/`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.doctors || [];
        setDoctorsCount(list.length);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const mockAppointments = [
    {
      id: 1,
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      date: "2024-12-25",
      time: "2:00 PM",
      status: "confirmed",
      paymentStatus: "paid",
      amount: 500,
    },
    {
      id: 2,
      patient: "Jane Smith",
      doctor: "Dr. Michael Chen",
      date: "2024-12-25",
      time: "3:00 PM",
      status: "confirmed",
      paymentStatus: "pending",
      amount: 500,
    },
  ];

  const totalRevenue = 1000;
  const pendingPayments = mockAppointments.filter(
    (apt) => apt.paymentStatus === "pending"
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doctorsCount}</p>
                <p className="text-sm text-gray-600">Total Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAppointments.length}</p>
                <p className="text-sm text-gray-600">Total Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalRevenue}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingPayments}</p>
                <p className="text-sm text-gray-600">Pending Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAppointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">
                    Appointment with {appointment.doctor}
                  </p>
                </div>
                <Badge
                  variant={
                    appointment.paymentStatus === "paid"
                      ? "default"
                      : "destructive"
                  }
                >
                  {appointment.paymentStatus}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
