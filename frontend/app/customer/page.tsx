"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Stethoscope,
  FileText,
  LogOut,
  Settings,
} from "lucide-react";

// Mock data
const mockAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "2024-12-25",
    time: "2:00 PM",
    status: "confirmed",
    reason: "Regular checkup",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Dermatology",
    date: "2024-12-20",
    time: "10:00 AM",
    status: "completed",
    reason: "Skin consultation",
  },
];

const mockPrescriptions = [
  {
    id: 1,
    doctor: "Dr. Michael Chen",
    date: "2024-12-20",
    medications: ["Antibiotic cream", "Moisturizer"],
    instructions: "Apply twice daily for 7 days",
  },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "customer") {
      router.push("/auth");
      return;
    }

    setUserEmail(email || "");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#1656a4]">
              Arogya
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              Welcome, {userEmail}
            </span>
            <Link href="/customer/settings">
              <Button
                variant="outline"
                size="sm"
                className="p-2 sm:px-3 bg-transparent"
              >
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="p-2 sm:px-3 bg-transparent"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Patient Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your appointments and health records
          </p>
        </div>

        <Tabs defaultValue="doctors" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-10 sm:h-12">
            <TabsTrigger value="doctors" className="text-xs sm:text-sm">
              Find Doctors
            </TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs sm:text-sm">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="text-xs sm:text-sm">
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-4 sm:space-y-6">
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1656a4]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-[#1656a4]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Find the Perfect Doctor
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Browse our qualified doctors by specialty or available dates to
                book your appointment
              </p>
              <Link href="/customer/browse">
                <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-lg font-semibold shadow-lg">
                  Browse All Doctors
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-2 border-[#1656a4]/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-[#1656a4] mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Browse by Date
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Select a date to see all available doctors
                  </p>
                  <Link href="/customer/browse?tab=by-date">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent"
                    >
                      View by Date
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#1656a4]/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 text-[#1656a4] mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Browse by Specialty
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Find doctors based on their medical specialty
                  </p>
                  <Link href="/customer/browse?tab=by-specialty">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent"
                    >
                      View by Specialty
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="grid gap-4">
              {mockAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1656a4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#1656a4]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm sm:text-base">
                            {appointment.doctor}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {appointment.specialty}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {appointment.reason}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-medium text-sm sm:text-base">
                          {appointment.date}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {appointment.time}
                        </p>
                        <Badge
                          variant={
                            appointment.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-2"
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <div className="grid gap-4">
              {mockPrescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm sm:text-base">
                          {prescription.doctor}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">
                          {prescription.date}
                        </p>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Medications:</h4>
                          <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600">
                            {prescription.medications.map((med, index) => (
                              <li key={index}>{med}</li>
                            ))}
                          </ul>

                          <h4 className="font-medium text-sm mt-3">
                            Instructions:
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {prescription.instructions}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="self-start bg-transparent"
                      >
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-sm">
                  Update your profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                      value={userEmail}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Gender</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                      <option>Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Blood Group</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                      <option>Select Blood Group</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Address</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    rows={3}
                    placeholder="Enter your complete address"
                  />
                </div>

                <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
