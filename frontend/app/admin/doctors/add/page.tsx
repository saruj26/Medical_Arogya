"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Plus,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";

import api from "@/lib/api";

export default function AddDoctorPage() {
  const router = useRouter();
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAddDoctor = async () => {
    if (!doctorForm.name || !doctorForm.email || !doctorForm.password) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields",
        confirmButtonColor: "#1656a4",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api(`/api/doctor/doctors/create/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doctorForm),
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "Doctor Added Successfully",
          text: `Dr. ${doctorForm.name} has been added to the system. Welcome email sent to ${doctorForm.email}`,
          confirmButtonColor: "#1656a4",
          timer: 3000,
          showConfirmButton: true,
        });
        router.push("/admin/doctors");
      } else {
        const message = data.message || JSON.stringify(data.errors || data);
        await Swal.fire({
          icon: "error",
          title: "Failed to Add Doctor",
          text: `Please check the information and try again: ${message}`,
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      await Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please check your connection and try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/doctors")}
            className="mb-4 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Add New Doctor</h2>
          <p className="text-gray-600 mt-1">
            Register a new medical professional to the Arogya platform
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Admin Access</span>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Doctor Registration</CardTitle>
              <CardDescription className="text-blue-100">
                Enter basic doctor details. The doctor will complete their profile on first login.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="doctorName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Full Name *
                </Label>
                <Input
                  id="doctorName"
                  value={doctorForm.name}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, name: e.target.value })
                  }
                  placeholder="John Smith"
                  className="h-12 border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl transition-all"
                />
                <p className="text-xs text-gray-500">Enter the doctor's full professional name</p>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="doctorEmail" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  Email Address *
                </Label>
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
                  placeholder="john.smith@arogya.com"
                  className="h-12 border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl transition-all"
                />
                <p className="text-xs text-gray-500">Professional email for login and communication</p>
              </div>

              {/* Phone Field */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-600" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={doctorForm.phone}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+94 21 343 3433"
                  className="h-12 border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl transition-all"
                />
                <p className="text-xs text-gray-500">Contact number for emergencies</p>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Temporary Password *
                </Label>
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
                  placeholder="Create a secure temporary password"
                  className="h-12 border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl transition-all"
                />
                <p className="text-xs text-gray-500">Doctor will change this on first login</p>
              </div>
            </div>

           
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/doctors")}
                className="flex-1 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl font-semibold"
                onClick={handleAddDoctor}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Adding Doctor...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Doctor to System
                  </>
                )}
              </Button>
            </div>

             {/* Information Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Next Steps After Registration</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Doctor will receive welcome email with login credentials</li>
                    <li>• Doctor must complete their professional profile on first login</li>
                    <li>• Profile includes specialty, qualifications, availability, and bio</li>
                    <li>• Account will be activated once profile is complete</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Required Fields Note */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                * Required fields must be filled to register the doctor
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Profile Completion</p>
            <p className="text-lg font-bold text-gray-900">Required</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Email Notification</p>
            <p className="text-lg font-bold text-gray-900">Automatic</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">System Access</p>
            <p className="text-lg font-bold text-gray-900">Immediate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}