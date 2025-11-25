"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
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
import {
  Plus,
  Trash2,
  CalendarDays,
  Clock,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  User,
  Eye,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

type Doctor = {
  id?: number;
  user_name: string;
  profile_image?: string | null;
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

import api from "@/lib/api";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api(`/api/doctor/doctors/`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list: Doctor[] = Array.isArray(data) ? data : data?.doctors || [];
        // Sort doctors by numeric part of doctor_id if available (DOC001 -> 1), fallback to `id`
        const sorted = list.sort((a, b) => {
          const parseNum = (d: Doctor) => {
            if (
              d.doctor_id &&
              typeof d.doctor_id === "string" &&
              d.doctor_id.toUpperCase().startsWith("DOC")
            ) {
              const num = parseInt(d.doctor_id.replace(/[^0-9]/g, ""), 10);
              return Number.isFinite(num) ? num : d.id || 0;
            }
            return d.id || 0;
          };
          return parseNum(a) - parseNum(b);
        });

        setDoctors(sorted);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Open the doctor detail modal and set the selected doctor
  const openDoctorDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  // Close the modal and clear the selected doctor
  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    const res = await Swal.fire({
      title: "Delete Doctor?",
      text: "This action will permanently remove the doctor from the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!res.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api(`/api/doctor/doctors/${doctorId}/`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Doctor Deleted",
          text: "Doctor has been successfully removed from the system.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchDoctors(); // Refresh list
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "An error occurred while deleting the doctor.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Doctors Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage medical professionals and their profiles
          </p>
        </div>
        <Link href="/admin/doctors/add">
          <Button className="bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Add New Doctor
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.length}
                </p>
                <p className="text-sm text-gray-600">Total Doctors</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter((d) => d.is_profile_complete).length}
                </p>
                <p className="text-sm text-gray-600">Active Doctors</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter((d) => !d.is_profile_complete).length}
                </p>
                <p className="text-sm text-gray-600">Pending Profiles</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(doctors.map((d) => d.specialty)).size}
                </p>
                <p className="text-sm text-gray-600">Specialties</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Table */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Medical Professionals
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {doctors.length} doctors
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Doctor
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Specialty
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Qualification
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-gray-200">
                          {doctor.profile_image ? (
                            // profile_image is expected to be an absolute URL from the backend (serializer uses use_url=True)
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={doctor.profile_image}
                              alt={doctor.user_name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                              {doctor.user_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Dr. {doctor.user_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {doctor.doctor_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {doctor.specialty || "Not Specified"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-700">
                            {doctor.user_email}
                          </span>
                        </div>
                        {doctor.user_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-700">
                              {doctor.user_phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {doctor.qualification && (
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-700">
                              {doctor.qualification}
                            </span>
                          </div>
                        )}
                        {doctor.experience && (
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-700">
                              {doctor.experience}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          doctor.is_profile_complete ? "default" : "secondary"
                        }
                        className={
                          doctor.is_profile_complete
                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                        }
                      >
                        {doctor.is_profile_complete ? "Active" : "Incomplete"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDoctorDetails(doctor)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {/* Edit button removed as requested */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            doctor.id && handleDeleteDoctor(doctor.id)
                          }
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {doctors.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                No doctors found
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Add your first doctor to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor Details Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
            style={{ maxHeight: "600px", height: "600px" }}
          >
            <div className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-4 border-white/30">
                      {selectedDoctor.profile_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedDoctor.profile_image}
                          alt={selectedDoctor.user_name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                          {selectedDoctor.user_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold">
                        Dr .{selectedDoctor.user_name}
                      </h3>
                      <p className="text-blue-100">
                        {selectedDoctor.specialty || "Medical Professional"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeModal}
                    className="text-white hover:bg-white/20 rounded-xl"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Basic Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Doctor ID:</span>{" "}
                        {selectedDoctor.doctor_id}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedDoctor.user_email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedDoctor.user_phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-green-600" />
                      Professional Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Qualification:</span>{" "}
                        {selectedDoctor.qualification || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Experience:</span>{" "}
                        {selectedDoctor.experience || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <Badge
                          variant={
                            selectedDoctor.is_profile_complete
                              ? "default"
                              : "secondary"
                          }
                          className={
                            selectedDoctor.is_profile_complete
                              ? "bg-green-100 text-green-800 ml-2"
                              : "bg-amber-100 text-amber-800 ml-2"
                          }
                        >
                          {selectedDoctor.is_profile_complete
                            ? "Active"
                            : "Incomplete Profile"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-purple-600" />
                    Availability Schedule
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium text-sm mb-2">
                        Available Days:
                      </p>
                      {selectedDoctor.available_days &&
                      selectedDoctor.available_days.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedDoctor.available_days.map((day, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                              {day}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No days specified
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Time Slots:</p>
                      {selectedDoctor.available_time_slots &&
                      selectedDoctor.available_time_slots.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedDoctor.available_time_slots.map(
                            (slot, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {slot}
                              </Badge>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No time slots specified
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {selectedDoctor.bio && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-600" />
                      Professional Bio
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
                      {selectedDoctor.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t p-6 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
