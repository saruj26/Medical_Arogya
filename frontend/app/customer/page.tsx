"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Calendar,
  FileText,
  Loader2,
  Clock,
  ArrowRight,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import api from "@/lib/api";

interface Appointment {
  id: number;
  appointment_id: string;
  doctor_name: string;
  doctor_specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  consultation_fee: string;
}

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

export default function CustomerDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") || "appointments";
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [userEmail, setUserEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    setUserEmail(email || "");
    fetchDashboardData(token);
    fetchUserProfile(token);
    const urlTab = searchParams?.get("tab");
    if (urlTab) setSelectedTab(urlTab);
  }, [router, searchParams]);

  const fetchUserProfile = async (token: string) => {
    try {
      setProfileLoading(true);
      const res = await fetch(api(`/api/user/profile/`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
        router.push("/");
        return;
      }

      const ct = res.headers.get("content-type") || "";
      if (res.ok) {
        try {
          if (ct.includes("application/json")) {
            const data = await res.json();
            const u = data.user || {};
            setName(u.name || "");
            setPhone(u.phone || "");
            setDob(u.date_of_birth || "");
            setGender(u.gender || "");
            setBloodGroup(u.blood_group || "");
            setAddress(u.address || "");
          } else {
            const text = await res.text();
            console.error("User profile endpoint returned non-JSON:", text);
            setProfileMessage(
              "Failed to load profile: server returned non-JSON response"
            );
          }
        } catch (e) {
          console.error("Failed to parse profile JSON:", e);
          setProfileMessage("Failed to parse profile response");
        }
      } else {
        try {
          const text = await res.text();
          console.error("Failed to fetch profile", res.status, text);
          setProfileMessage(`Failed to fetch profile: ${res.status}`);
        } catch (e) {
          console.error("Failed to fetch profile", res.status, e);
          setProfileMessage("Failed to fetch profile");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true);
      setFetchError(null);
      const appointmentsRes = await fetch(
        api(`/api/appointment/appointments/`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const prescriptionsRes = await fetch(
        api(`/api/appointment/prescriptions/`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (appointmentsRes.status === 401 || prescriptionsRes.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");
        router.push("/");
        return;
      }

      try {
        const ct = appointmentsRes.headers.get("content-type") || "";
        if (appointmentsRes.ok) {
          if (ct.includes("application/json")) {
            const appointmentsData = await appointmentsRes.json();
            setAppointments(appointmentsData.appointments || []);
          } else {
            const text = await appointmentsRes.text();
            console.error(
              "Appointments fetch returned non-JSON OK response:",
              text
            );
            setFetchError("Server returned non-JSON response");
          }
        } else {
          if (ct.includes("application/json")) {
            const errBody = await appointmentsRes.json();
            console.error(
              "Appointments fetch error:",
              appointmentsRes.status,
              errBody
            );
            setFetchError(
              errBody.message || `Server returned ${appointmentsRes.status}`
            );
          } else {
            const text = await appointmentsRes.text();
            console.error(
              "Appointments fetch error (non-JSON):",
              appointmentsRes.status,
              text
            );
            setFetchError(
              `${text.substring(0, 400)}${text.length > 400 ? "..." : ""}`
            );
          }
        }
      } catch (e) {
        console.error("Error processing appointments response", e);
        setFetchError("Failed to load appointments");
      }

      if (prescriptionsRes.ok) {
        const prescriptionsData = await prescriptionsRes.json();
        setPrescriptions(prescriptionsData.prescriptions || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/");
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

  const handleProfileUpdate = async () => {
    setProfileMessage(null);
    setProfileLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const profileData = {
        name: name,
        phone: phone,
        date_of_birth: dob || null,
        gender: gender,
        blood_group: bloodGroup,
        address: address,
      };

      const res = await fetch(api("/api/user/profile/"), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setProfileMessage("Profile updated successfully");
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const u = JSON.parse(stored);
            const updated = {
              ...u,
              name: name,
              phone: phone,
              date_of_birth: dob,
              gender: gender,
              blood_group: bloodGroup,
              address: address,
            };
            localStorage.setItem("user", JSON.stringify(updated));
          } catch (e) {
            console.error("Error updating localStorage:", e);
          }
        }
      } else {
        setProfileMessage(
          data.message || data.errors
            ? JSON.stringify(data.errors)
            : "Failed to update profile"
        );
      }
    } catch (e) {
      console.error("Profile update error:", e);
      setProfileMessage("Failed to update profile");
    } finally {
      setProfileLoading(false);
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[#1656a4]" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    appointments: {
      title: "My Appointments",
      subtitle: "Manage your upcoming and past appointments",
    },
    doctors: {
      title: "Find Doctors",
      subtitle: "Browse and book appointments with qualified doctors",
    },
    prescriptions: {
      title: "Prescriptions",
      subtitle: "View and download your prescriptions",
    },
    profile: {
      title: "My Profile",
      subtitle: "Update your personal and medical information",
    },
    tips: {
      title: "Health & Wellness Tips",
      subtitle: "Expert advice to help you maintain a healthy lifestyle",
    },
    chat: {
      title: "Health Assistant",
      subtitle: "Ask medical questions and get general guidance",
    },
    default: {
      title: "Patient Dashboard",
      subtitle:
        "Manage your appointments, prescriptions, and health information",
    },
  };

  const current = pageTitles[selectedTab] || pageTitles.default;

  return (
    <div className="space-y-8">
      {/* Header Section (dynamic based on selected tab) */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {current.title}
        </h1>
        <p className="text-base text-gray-600">{current.subtitle}</p>
      </div>

      {selectedTab === "doctors" && (
        <div className="space-y-6">
          <div className="text-center py-12 bg-gradient-to-br from-[#1656a4]/5 to-[#1656a4]/10 rounded-2xl border border-[#1656a4]/20 relative overflow-hidden">
            {/* Decorative background image: doctor checking patient (low opacity) */}
            <img
              src="/doctor-check.svg"
              aria-hidden="true"
              className="absolute left-1/2 top-4 transform -translate-x-1/2 w-72 sm:w-[420px] opacity-10 pointer-events-none select-none"
            />

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Stethoscope className="w-10 h-10 text-[#1656a4]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Find the Perfect Doctor
              </h2>
              <p className="text-base text-gray-600 mb-8 max-w-md mx-auto px-4">
                Browse our qualified doctors by specialty or available dates to
                book your appointment
              </p>
              <Link href="/customer/browse">
                <Button className="bg-[#1656a4] hover:bg-[#0f3f7f] h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                  Browse All Doctors <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="border-2 border-[#1656a4]/20 hover:shadow-xl hover:border-[#1656a4]/40 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1656a4]/10 to-[#1656a4]/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-[#1656a4]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Browse by Date
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-5">
                  Select a date to see all available doctors
                </p>
                <Link href="/customer/browse?tab=by-date">
                  <Button
                    variant="outline"
                    className="w-full border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white font-medium bg-transparent"
                  >
                    View by Date
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#1656a4]/20 hover:shadow-xl hover:border-[#1656a4]/40 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1656a4]/10 to-[#1656a4]/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-[#1656a4]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Browse by Specialty
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-5">
                  Find doctors based on their medical specialty
                </p>
                <Link href="/customer/browse?tab=by-specialty">
                  <Button
                    variant="outline"
                    className="w-full border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white font-medium bg-transparent"
                  >
                    View by Specialty
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedTab === "appointments" && (
        <div className="space-y-4">
          {fetchError ? (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Could not load appointments
                </h3>
                <p className="text-gray-600 mb-4">{fetchError}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Check server logs or your network connection.
                </p>
                <Button
                  onClick={() =>
                    fetchDashboardData(localStorage.getItem("token") || "")
                  }
                  className="bg-[#1656a4] hover:bg-[#0f3f7f]"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : appointments.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Appointments Found
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't booked any appointments yet.
                </p>
                <Link href="/customer/browse">
                  <Button className="bg-[#1656a4] hover:bg-[#0f3f7f]">
                    Find Doctors & Book
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="cursor-pointer border-l-4 border-l-[#1656a4] hover:shadow-lg transition-all duration-300 hover:border-l-[#0f3f7f]"
                onClick={() =>
                  router.push(`/customer/appointment/${appointment.id}`)
                }
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-[#0f3f7f] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-gray-900">
                          {appointment.doctor_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.doctor_specialty}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.reason}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          ID: {appointment.appointment_id}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="font-semibold text-base text-gray-900">
                        {new Date(
                          appointment.appointment_date
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.appointment_time}
                      </p>
                      <Badge
                        variant={getStatusVariant(appointment.status)}
                        className="mt-3 capitalize inline-block"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedTab === "prescriptions" && (
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Prescriptions Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Your prescriptions will appear here after doctor
                  consultations.
                </p>
                <Link href="/customer/browse">
                  <Button className="bg-[#1656a4] hover:bg-[#0f3f7f]">
                    Book an Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            prescriptions.map((prescription) => (
              <Card
                key={prescription.id}
                className="cursor-pointer border-l-4 border-l-[#1656a4] hover:shadow-lg transition-all duration-300 hover:border-l-[#0f3f7f]"
                onClick={() =>
                  router.push(`/customer/prescription/${prescription.id}`)
                }
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-[#0f3f7f] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {prescription.doctor_name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 w-fit text-xs sm:text-sm"
                          >
                            {prescription.doctor_specialty}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0 text-[#1656a4]" />
                            <span>
                              {new Date(
                                prescription.appointment_date
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0 text-[#1656a4]" />
                            <span>{prescription.appointment_time}</span>
                          </div>
                        </div>

                        {prescription.diagnosis && (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <h4 className="font-semibold text-sm text-amber-900 mb-1">
                              Diagnosis
                            </h4>
                            <p className="text-sm text-amber-800">
                              {prescription.diagnosis}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-56 flex flex-col gap-3">
                      <div className="space-y-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200 border w-fit">
                          Completed
                        </Badge>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-sm text-gray-900 mb-3">
                            Medications
                          </h4>
                          <div className="space-y-2">
                            {prescription.medications
                              .slice(0, 2)
                              .map((med: any, index: number) => (
                                <div
                                  key={index}
                                  className="text-xs text-gray-700 flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-[#1656a4] rounded-full mt-1 flex-shrink-0" />
                                  <span className="truncate">
                                    {typeof med === "string"
                                      ? med
                                      : `${med.name} (${med.dosage})`}
                                  </span>
                                </div>
                              ))}
                            {prescription.medications.length > 2 && (
                              <div className="text-xs text-gray-500 font-medium pt-1">
                                +{prescription.medications.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white font-medium bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/customer/prescription/${prescription.id}`
                            );
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 font-medium bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPrescription(prescription);
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedTab === "profile" && (
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#0f3f7f] text-white">
              <CardTitle className="text-2xl">Personal Information</CardTitle>
              <CardDescription className="text-blue-100">
                Update your profile details and medical information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    value={userEmail}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Blood Group
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Address
                </label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                  rows={4}
                  placeholder="Enter your complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                <Button
                  className="bg-[#1656a4] hover:bg-[#0f3f7f] text-white font-semibold h-11 px-6 sm:w-auto w-full"
                  onClick={handleProfileUpdate}
                  disabled={profileLoading}
                >
                  {profileLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
                {profileMessage && (
                  <span
                    className={`text-sm font-medium ${
                      profileMessage.includes("successfully")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {profileMessage}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
