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

import api from "@/lib/api";

export default function AddDoctorPage() {
  const router = useRouter();
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleAddDoctor = async () => {
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
          title: "Doctor added",
          text: `Doctor added successfully! Welcome email sent to ${doctorForm.email}`,
        });
        router.push("/admin/doctors");
      } else {
        const message = data.message || JSON.stringify(data.errors || data);
        await Swal.fire({
          icon: "error",
          title: "Add failed",
          text: `Failed to add doctor: ${message}`,
        });
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      await Swal.fire({
        icon: "error",
        title: "Add failed",
        text: "Failed to add doctor. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Doctor</CardTitle>
          <CardDescription>
            Enter basic doctor details. The doctor will complete their profile
            on first login.
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
              onClick={() => router.push("/admin/doctors")}
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
    </div>
  );
}
