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
import { Plus, Edit, Trash2, CalendarDays, Clock } from "lucide-react";

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

import api from "@/lib/api";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

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
        setDoctors(list);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    const res = await Swal.fire({
      title: "Delete doctor?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
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
          title: "Deleted",
          text: "Doctor deleted successfully",
        });
        fetchDoctors(); // Refresh list
      } else {
        await Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: "Failed to delete doctor",
        });
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Failed to delete doctor",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Doctors</h2>
        <Link href="/admin/doctors/add">
          <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </Link>
      </div>

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
                    <p className="text-sm text-gray-600">
                      ID: {doctor.doctor_id}
                    </p>

                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <p>📧 {doctor.user_email}</p>
                      <p>📞 {doctor.user_phone || "Phone not set"}</p>
                      {doctor.qualification && <p>🎓 {doctor.qualification}</p>}
                      {doctor.experience && (
                        <p>⏱️ {doctor.experience} experience</p>
                      )}
                    </div>

                    {/* Availability Information */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          Available Days:
                        </span>
                      </div>
                      {doctor.available_days &&
                      doctor.available_days.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {doctor.available_days.map((day, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {day}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No availability set
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Time Slots:</span>
                      </div>
                      {doctor.available_time_slots &&
                      doctor.available_time_slots.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {doctor.available_time_slots.map((slot, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No time slots set
                        </p>
                      )}

                      {doctor.bio && (
                        <>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm font-medium">Bio:</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {doctor.bio}
                          </p>
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
                    {doctor.is_profile_complete
                      ? "Active"
                      : "Incomplete Profile"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => doctor.id && handleDeleteDoctor(doctor.id)}
                  >
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
}
