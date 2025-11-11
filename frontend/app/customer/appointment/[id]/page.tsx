"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AppointmentDetail() {
  const router = useRouter();
  // next/navigation useParams is only available in server components; we'll parse from pathname as fallback
  const [appointment, setAppointment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // extract id from the URL
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

  const handleCancel = async () => {
    if (!appointment) return;
    if (
      !confirm(
        "Are you sure you want to cancel this appointment? A 20% cancellation fee will be retained by the company."
      )
    )
      return;

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
        alert(
          `Appointment cancelled. Company fee: ₹${data.company_fee}. Refund: ₹${data.refund_amount}`
        );
        router.push("/customer");
      } else {
        alert(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to cancel appointment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1656a4]" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Appointment not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Doctor</h4>
                <p className="text-sm text-gray-700">
                  {appointment.doctor_name} — {appointment.doctor_specialty}
                </p>

                <h4 className="font-medium mt-4">Date & Time</h4>
                <p className="text-sm text-gray-700">
                  {new Date(appointment.appointment_date).toLocaleDateString()}{" "}
                  at {appointment.appointment_time}
                </p>

                <h4 className="font-medium mt-4">Reason</h4>
                <p className="text-sm text-gray-700">{appointment.reason}</p>

                <h4 className="font-medium mt-4">Status</h4>
                <Badge className="mt-2 capitalize">{appointment.status}</Badge>
              </div>

              <div>
                <h4 className="font-medium">Patient</h4>
                <p className="text-sm text-gray-700">
                  {appointment.patient_name}
                </p>
                <p className="text-sm text-gray-700">
                  Age: {appointment.patient_age} • {appointment.patient_gender}
                </p>
                <p className="text-sm text-gray-700">
                  Phone: {appointment.patient_phone}
                </p>

                <h4 className="font-medium mt-4">Payment</h4>
                <p className="text-sm text-gray-700">
                  Method: {appointment.payment_method || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  Paid: {appointment.payment_status ? "Yes" : "No"}
                </p>
                <p className="text-sm text-gray-700">
                  Amount: ₹{appointment.consultation_fee}
                </p>

                {appointment.status !== "cancelled" && (
                  <div className="mt-6">
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleCancel}
                      disabled={processing}
                    >
                      {processing ? "Cancelling..." : "Cancel Appointment"}
                    </Button>
                  </div>
                )}

                {appointment.status === "cancelled" && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-700">
                      This appointment was cancelled.
                    </p>
                    {appointment.company_fee && (
                      <p className="text-sm text-gray-700">
                        Company fee retained: ₹{appointment.company_fee}
                      </p>
                    )}
                    {appointment.refund_amount && (
                      <p className="text-sm text-gray-700">
                        Refund issued: ₹{appointment.refund_amount}
                      </p>
                    )}
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
