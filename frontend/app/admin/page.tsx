
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Calendar,
  CreditCard,
  Stethoscope,
  LogOut,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Settings,
  Menu,
  X,
  Home,
  BarChart3,
  Clock,
  CalendarDays,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  type Doctor = {
    id?: number;
    user_name: string;
    specialty?: string;
    doctor_id?: string | number;
    user_email?: string;
    user_phone?: string;
    qualification?: string;
    experience?: string;
    available_days?: string[];
    available_time_slots?: string[];
    bio?: string;
    is_profile_complete?: boolean;
  };

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "admin") {
      router.push("/auth");
      return;
    }

    setUserEmail(email || "");
    fetchDoctors();
  }, [router]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
      const response = await fetch(`${API_BASE_URL}/doctor/doctors/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // API may return an array or an object containing a doctors array
        const list: Doctor[] = Array.isArray(data) ? data : data?.doctors || [];
        setDoctors(list);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleAddDoctor = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
      const response = await fetch(`${API_BASE_URL}/doctor/doctors/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doctorForm),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Doctor added successfully! Welcome email sent to ${doctorForm.email}`);
        setDoctorForm({
          name: "",
          email: "",
          phone: "",
          password: "",
        });
        setShowAddDoctor(false);
        fetchDoctors(); // Refresh doctors list
      } else {
        const message = data.message || JSON.stringify(data.errors || data);
        alert(`Failed to add doctor: ${message}`);
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor. Please try again.");
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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
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
                      <p className="text-2xl font-bold">{doctors.length}</p>
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

      case "doctors":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Doctors</h2>
              <Button
                className="bg-[#1656a4] hover:bg-[#1656a4]/90"
                onClick={() => setShowAddDoctor(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </div>

            {showAddDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Doctor</CardTitle>
                  <CardDescription>
                    Enter basic doctor details. The doctor will complete their profile on first login.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctorName">Full Name</Label>
                      <Input
                        id="doctorName"
                        value={doctorForm.name}
                        onChange={(e) =>
                          setDoctorForm({ ...doctorForm, name: e.target.value })
                        }
                        placeholder="Dr. John Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="doctorEmail">Email</Label>
                      <Input
                        id="doctorEmail"
                        type="email"
                        value={doctorForm.email}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="john.smith@Arogya.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={doctorForm.phone}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Temporary Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={doctorForm.password}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Temporary password"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDoctor(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#1656a4] hover:bg-[#1656a4]/90"
                      onClick={handleAddDoctor}
                    >
                      Add Doctor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {doctor.user_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {doctor.user_name}
                          </h3>
                          <p className="text-[#1656a4] font-medium">
                            {doctor.specialty || "Specialty not set"}
                          </p>
                          <p className="text-sm text-gray-600">ID: {doctor.doctor_id}</p>
                          
                          <div className="text-sm text-gray-600 space-y-1 mt-2">
                            <p>📧 {doctor.user_email}</p>
                            <p>📞 {doctor.user_phone || "Phone not set"}</p>
                            {doctor.qualification && <p>🎓 {doctor.qualification}</p>}
                            {doctor.experience && <p>⏱️ {doctor.experience} experience</p>}
                          </div>

                          {/* Availability Information */}
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium">Available Days:</span>
                            </div>
                            {doctor.available_days && doctor.available_days.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {doctor.available_days.map((day, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {day}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No availability set</p>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium">Time Slots:</span>
                            </div>
                            {doctor.available_time_slots && doctor.available_time_slots.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {doctor.available_time_slots.map((slot, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {slot}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No time slots set</p>
                            )}

                            {doctor.bio && (
                              <>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm font-medium">Bio:</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            doctor.is_profile_complete ? "default" : "secondary"
                          }
                        >
                          {doctor.is_profile_complete ? "Active" : "Incomplete Profile"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "analytics":
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1656a4]">
                Arogya Admin
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "doctors" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("doctors")}
              >
                <Users className="w-4 h-4 mr-2" />
                Doctors
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </nav>
          </div>

          <div className="p-4 border-t">
            <div className="space-y-2">
              <Link href="/admin/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {activeTab.replace("-", " ")}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Admin: {userEmail}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}