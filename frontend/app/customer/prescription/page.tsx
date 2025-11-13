// app/customer/prescriptions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  Clock,
  Loader2,
  Download,
  Eye,
  Stethoscope,
  Pill,
  User,
  ArrowRight,
  Shield,
} from "lucide-react";
import api from "@/lib/api";

interface Prescription {
  id: number;
  doctor_name: string;
  appointment_date: string;
  medications: any[];
  instructions: string;
  diagnosis: string;
  doctor_specialty?: string;
  appointment_time?: string;
}

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    fetchPrescriptions(token);
  }, [router]);

  const fetchPrescriptions = async (token: string) => {
    try {
      setLoading(true);
      const prescriptionsRes = await fetch(
        api(`/api/appointment/prescriptions/`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (prescriptionsRes.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");
        router.push("/");
        return;
      }

      if (prescriptionsRes.ok) {
        const prescriptionsData = await prescriptionsRes.json();
        setPrescriptions(prescriptionsData.prescriptions || []);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrescription = async (prescription: Prescription) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const res = await fetch(
        api(`/api/appointment/prescriptions/${prescription.id}/download/`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to download prescription", res.status);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescription_${prescription.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error downloading prescription:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <FileText className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading your prescriptions...</p>
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
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Medical Prescriptions</h1>
                  <p className="text-sm text-gray-600">Expert medical care at your fingertips</p>
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
      
      <div className="container mx-auto py-2">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-900 to-cyan-800 bg-clip-text text-transparent">
            My Prescriptions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access and manage all your medical prescriptions in one secure location.
          </p>
        </div>

        {/* Stats Overview
        {prescriptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{prescriptions.length}</h3>
                <p className="text-sm text-gray-600">Total Prescriptions</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Pill className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {prescriptions.reduce((total, prescription) => total + prescription.medications.length, 0)}
                </h3>
                <p className="text-sm text-gray-600">Medications Prescribed</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {new Set(prescriptions.map(p => p.doctor_name)).size}
                </h3>
                <p className="text-sm text-gray-600">Consulting Doctors</p>
              </CardContent>
            </Card>
          </div>
        )} */}

        {/* Prescriptions List */}
        <div className="space-y-6">
          {prescriptions.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm text-center py-16">
              <CardContent>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Prescriptions Yet
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Your prescriptions will appear here after doctor consultations.
                </p>
                <Link href="/customer/doctors">
                  <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base font-semibold">
                    Book an Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm">
                  {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {prescriptions.map((prescription) => (
                <Card
                  key={prescription.id}
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/customer/prescription/${prescription.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Doctor & Prescription Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                Dr. {prescription.doctor_name}
                              </h3>
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200 border-2 px-3 py-1 font-medium">
                                <Stethoscope className="w-3 h-3 mr-1" />
                                {prescription.doctor_specialty || "General Medicine"}
                              </Badge>
                            </div>

                            {/* Appointment Date & Time */}
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">
                                  {new Date(prescription.appointment_date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              {prescription.appointment_time && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">{prescription.appointment_time}</span>
                                </div>
                              )}
                            </div>

                            {/* Diagnosis */}
                            {prescription.diagnosis && (
                              <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                <h4 className="font-semibold text-sm text-amber-900 mb-2 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Diagnosis
                                </h4>
                                <p className="text-sm text-amber-800 font-medium">
                                  {prescription.diagnosis}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Medications & Actions */}
                        <div className="lg:w-80 flex flex-col gap-4">
                          {/* Medications Preview */}
                          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                            <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                              <Pill className="w-4 h-4 text-blue-600" />
                              Medications ({prescription.medications.length})
                            </h4>
                            <div className="space-y-2 max-h-24 overflow-y-auto">
                              {prescription.medications.slice(0, 3).map((med: any, index: number) => (
                                <div
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2 bg-white p-2 rounded-lg border border-gray-100"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                                  <span className="font-medium">
                                    {typeof med === "string"
                                      ? med
                                      : `${med.name} (${med.dosage})`}
                                  </span>
                                </div>
                              ))}
                              {prescription.medications.length > 3 && (
                                <div className="text-xs text-gray-500 font-medium text-center pt-1 border-t border-gray-200">
                                  +{prescription.medications.length - 3} more medications
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold h-11 transition-all duration-300 group/view"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/customer/prescription/${prescription.id}`);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2 group-hover/view:scale-110 transition-transform" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold h-11 transition-all duration-300 group/download"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadPrescription(prescription);
                              }}
                            >
                              <Download className="w-4 h-4 mr-2 group-hover/download:scale-110 transition-transform" />
                              Download
                            </Button>
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
        {prescriptions.length > 0 && (
          <div className="mt-12 text-center">
            <Link href="/customer/appointments">
              <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base font-semibold">
                View Appointments History
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}