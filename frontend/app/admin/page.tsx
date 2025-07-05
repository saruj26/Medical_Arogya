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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

// Mock data
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@Arogya.com",
    specialty: "Cardiology",
    experience: "15 years",
    qualification: "MBBS, MD Cardiology",
    phone: "+91 98765 43210",
    status: "active",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@Arogya.com",
    specialty: "Dermatology",
    experience: "12 years",
    qualification: "MBBS, MD Dermatology",
    phone: "+91 98765 43211",
    status: "active",
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    email: "emily.davis@Arogya.com",
    specialty: "Pediatrics",
    experience: "10 years",
    qualification: "MBBS, MD Pediatrics",
    phone: "+91 98765 43212",
    status: "inactive",
  },
];

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
  {
    id: 3,
    patient: "Mike Johnson",
    doctor: "Dr. Sarah Johnson",
    date: "2024-12-24",
    time: "10:00 AM",
    status: "completed",
    paymentStatus: "paid",
    amount: 500,
  },
];

const mockPayments = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Sarah Johnson",
    amount: 500,
    date: "2024-12-25",
    method: "online",
    status: "completed",
  },
  {
    id: 2,
    patient: "Mike Johnson",
    doctor: "Dr. Sarah Johnson",
    amount: 500,
    date: "2024-12-24",
    method: "cash",
    status: "completed",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    specialty: "",
    experience: "",
    qualification: "",
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  const handleAddDoctor = () => {
    // Simulate adding doctor and sending email
    console.log("Adding doctor:", doctorForm);

    // Simulate email sending
    const emailContent = `
    Welcome to Arogya!
    
    Your doctor account has been created with the following details:
    Email: ${doctorForm.email}
    Temporary Password: ${doctorForm.password}
    
    Please log in and change your password immediately for security.
    
    Login at: ${window.location.origin}/auth
    
    Best regards,
    Arogya Admin Team
  `;

    console.log("Email sent to doctor:", emailContent);
    alert(
      `Doctor added successfully! Welcome email sent to ${doctorForm.email}`
    );

    setDoctorForm({
      name: "",
      email: "",
      specialty: "",
      experience: "",
      qualification: "",
      phone: "",
      password: "",
    });
    setShowAddDoctor(false);
  };

  const handlePaymentUpdate = (appointmentId: number, status: string) => {
    // Simulate payment status update
    console.log(
      "Updating payment for appointment:",
      appointmentId,
      "to:",
      status
    );
  };

  const totalRevenue = mockPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const pendingPayments = mockAppointments.filter(
    (apt) => apt.paymentStatus === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1656a4]">
              Arogya Admin
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin: {userEmail}</span>
            <Link href="/admin/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage doctors, appointments, and payments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockDoctors.length}</p>
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
                  <p className="text-2xl font-bold">
                    {mockAppointments.length}
                  </p>
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

        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-6">
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
                    Enter doctor details to add them to the system
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
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select
                        value={doctorForm.specialty}
                        onValueChange={(value) =>
                          setDoctorForm({ ...doctorForm, specialty: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="dermatology">
                            Dermatology
                          </SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="orthopedics">
                            Orthopedics
                          </SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="general">
                            General Medicine
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        value={doctorForm.experience}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            experience: e.target.value,
                          })
                        }
                        placeholder="10 years"
                      />
                    </div>
                    <div>
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input
                        id="qualification"
                        value={doctorForm.qualification}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            qualification: e.target.value,
                          })
                        }
                        placeholder="MBBS, MD"
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
                      placeholder="Temporary password for doctor"
                    />
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
              {mockDoctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {doctor.name}
                          </h3>
                          <p className="text-[#1656a4] font-medium">
                            {doctor.specialty}
                          </p>
                          <div className="text-sm text-gray-600 space-y-1 mt-2">
                            <p>📧 {doctor.email}</p>
                            <p>📞 {doctor.phone}</p>
                            <p>🎓 {doctor.qualification}</p>
                            <p>⏱️ {doctor.experience} experience</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            doctor.status === "active" ? "default" : "secondary"
                          }
                        >
                          {doctor.status}
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
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <h2 className="text-xl font-semibold">All Appointments</h2>
            <div className="grid gap-4">
              {mockAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {appointment.patient}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.doctor}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            ₹{appointment.amount}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              appointment.paymentStatus === "paid"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {appointment.paymentStatus}
                          </Badge>
                          {appointment.paymentStatus === "pending" && (
                            <Button
                              size="sm"
                              className="mt-2 bg-[#1656a4] hover:bg-[#1656a4]/90"
                              onClick={() =>
                                handlePaymentUpdate(appointment.id, "paid")
                              }
                            >
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <h2 className="text-xl font-semibold">Payment Management</h2>
            <div className="grid gap-4">
              {mockPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{payment.patient}</h3>
                          <p className="text-sm text-gray-600">
                            {payment.doctor}
                          </p>
                          <p className="text-sm text-gray-500">
                            {payment.date}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ₹{payment.amount}
                        </p>
                        <Badge variant="default" className="mt-1">
                          {payment.method}
                        </Badge>
                        <p className="text-sm text-green-600 mt-1">
                          {payment.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
