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
import { Calendar, FileText, Loader2, Clock } from "lucide-react";
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
  // allow medication entries to be either strings or objects so rendering logic remains flexible
  medications: any[];
  instructions: string;
  diagnosis: string;
  // added optional fields used in the UI
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
    // react to changes in the URL tab param
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
      // Prepare the data exactly as the backend expects
      const profileData = {
        name: name,
        phone: phone,
        date_of_birth: dob || null, // Send null if empty
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
        // Update localStorage user data
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1656a4]" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Patient Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your appointments and health records
        </p>
      </div>

      {/* Main content (layout provides header + sidebar) */}
      {selectedTab === "doctors" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1656a4]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 text-[#1656a4] mx-auto mb-0">{/* decorative */}</div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Find the Perfect Doctor
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Browse our qualified doctors by specialty or available dates to book your appointment
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
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Browse by Date</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Select a date to see all available doctors</p>
                <Link href="/customer/browse?tab=by-date">
                  <Button variant="outline" size="sm" className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent">View by Date</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#1656a4]/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 text-[#1656a4] mx-auto mb-3 sm:mb-4">{/* decorative */}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Browse by Specialty</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Find doctors based on their medical specialty</p>
                <Link href="/customer/browse?tab=by-specialty">
                  <Button variant="outline" size="sm" className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent">View by Specialty</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedTab === "appointments" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {fetchError ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Could not load appointments</h3>
                  <p className="text-gray-600 mb-4">{fetchError}</p>
                  <p className="text-sm text-gray-500 mb-4">Check server logs or your network connection.</p>
                </CardContent>
              </Card>
            ) : appointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
                  <p className="text-gray-600 mb-4">You haven't booked any appointments yet.</p>
                  <Link href="/customer/browse">
                    <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Find Doctors</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment.id} className="cursor-pointer" onClick={() => router.push(`/customer/appointment/${appointment.id}`)}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1656a4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#1656a4]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm sm:text-base">{appointment.doctor_name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{appointment.doctor_specialty}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{appointment.reason}</p>
                          <p className="text-xs text-gray-400 mt-1">ID: {appointment.appointment_id}</p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-medium text-sm sm:text-base">{new Date(appointment.appointment_date).toLocaleDateString()}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{appointment.appointment_time}</p>
                        <Badge variant={getStatusVariant(appointment.status)} className="mt-2 capitalize">{appointment.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {selectedTab === "prescriptions" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {prescriptions.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prescriptions Yet</h3>
                  <p className="text-gray-600 mb-4">Your prescriptions will appear here after doctor consultations.</p>
                  <Link href="/customer/browse">
                    <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Book an Appointment</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              prescriptions.map((prescription) => (
                <Card key={prescription.id} className="cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 border-l-[#1656a4]" onClick={() => router.push(`/customer/prescription/${prescription.id}`)}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Section - Doctor Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-[#1e40af] rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{prescription.doctor_name}</h3>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">{prescription.doctor_specialty}</Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(prescription.appointment_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{prescription.appointment_time}</span>
                            </div>
                          </div>

                          {prescription.diagnosis && (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <h4 className="font-medium text-sm text-amber-800 mb-1">Diagnosis</h4>
                              <p className="text-sm text-amber-700">{prescription.diagnosis}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Quick Info & Actions */}
                      <div className="lg:w-48 flex flex-col gap-3">
                        <div className="space-y-2">
                          <div className="text-right">
                            <Badge variant="secondary" className="bg-green-50 text-green-700">Completed</Badge>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-sm text-gray-900 mb-2">Medications</h4>
                            <div className="space-y-1">
                              {prescription.medications.slice(0, 2).map((med: any, index: number) => (
                                <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  <span className="truncate">{typeof med === "string" ? med : `${med.name} (${med.dosage})`}</span>
                                </div>
                              ))}
                              {prescription.medications.length > 2 && (<div className="text-xs text-gray-500">+{prescription.medications.length - 2} more</div>)}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white" onClick={(e) => { e.stopPropagation(); router.push(`/customer/prescription/${prescription.id}`); }}>
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleDownloadPrescription(prescription); }}>
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
        </div>
      )}

      {selectedTab === "profile" && (
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
              <CardDescription className="text-sm">Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" value={userEmail} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input type="tel" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  <input type="date" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Blood Group</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
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

              <div>
                <label className="text-sm font-medium">Address</label>
                <textarea className="w-full mt-1 px-3 py-2 border rounded-md text-sm" rows={3} placeholder="Enter your complete address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90" onClick={handleProfileUpdate} disabled={profileLoading}>
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
                  <span className={`text-sm ${profileMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{profileMessage}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
