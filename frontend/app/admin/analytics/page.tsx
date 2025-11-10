"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
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
      <h2 className="text-xl font-semibold">Analytics & Reports</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-semibold">₹{totalRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span>This Month:</span>
                <span className="font-semibold">₹{totalRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Payments:</span>
                <span className="font-semibold text-orange-600">
                  ₹{pendingPayments * 500}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Appointments:</span>
                <span className="font-semibold">
                  {mockAppointments.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-semibold text-green-600">
                  {
                    mockAppointments.filter(
                      (apt) => apt.status === "completed"
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Upcoming:</span>
                <span className="font-semibold text-blue-600">
                  {
                    mockAppointments.filter(
                      (apt) => apt.status === "confirmed"
                    ).length
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}