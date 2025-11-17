"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText,
  User,
  Calendar,
  Clock,
  Phone,
  Plus,
  Trash2,
  ArrowLeft,
  Stethoscope,
  Pill,
  ClipboardList,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  duration: string;
}

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams?.get("appointment");

  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<any | null>(null);
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", duration: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appointmentId) return;
    fetchAppointment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        api(`/api/appointment/appointments/${appointmentId}/`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        setError("Failed to load appointment");
        return;
      }
      const data = await res.json();
      if (data && data.success === false) {
        setError(data.message || "Failed to load appointment");
        return;
      }
      setAppointment(data.appointment || data);
    } catch (e) {
      console.error(e);
      setError("Failed to load appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const copy = medications.slice();
    copy[index] = { ...copy[index], [field]: value };
    setMedications(copy);
  };

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", duration: "" }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length === 1) return;
    const copy = medications.slice();
    copy.splice(index, 1);
    setMedications(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!appointmentId) {
      setError("No appointment selected");
      return;
    }

    // Validate required fields
    if (!diagnosis.trim()) {
      setError("Diagnosis is required");
      return;
    }

    if (
      medications.some(
        (med) => med.name.trim() && (!med.dosage.trim() || !med.duration.trim())
      )
    ) {
      setError("Please complete all medication fields for added medications");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        appointment: Number(appointmentId),
        medications: medications.filter((med) => med.name.trim() !== ""),
        instructions,
        diagnosis,
        notes,
        follow_up_date: followUpDate || null,
      };

      const res = await fetch(api(`/api/appointment/prescriptions/create/`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || JSON.stringify(data));
        return;
      }

      if (data && data.success === false) {
        setError(data.message || "Failed to create prescription");
        return;
      }

      // On success navigate back to doctor's appointments
      router.push(`/doctor/appointments`);
    } catch (e) {
      console.error(e);
      setError("Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <Stethoscope className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading appointment details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
            <span className="text-gray-800 font-medium">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" />
              Create Prescription
            </h1>
            <p className="text-gray-600">
              Prescribe medications and treatment plan for your patient
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Patient Information Card */}
          <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 border-2 border-blue-100">
                  <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold text-lg">
                    {appointment?.patient_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "P"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {appointment?.patient_name || "Loading..."}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      Appointment ID: {appointment?.appointment_id}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>
                        Age: {appointment?.patient_age} •{" "}
                        {appointment?.patient_gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{appointment?.patient_phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>
                        {appointment?.appointment_date
                          ? new Date(
                              appointment.appointment_date
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Loading..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>
                        {appointment?.appointment_time || "Time not specified"}
                      </span>
                    </div>
                  </div>

                  {appointment?.reason && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-sm text-gray-700 mb-1 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Reason for Visit
                      </h4>
                      <p className="text-sm text-gray-600">
                        {appointment.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Form */}
          <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
            <CardContent className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Diagnosis and Follow-up in same row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      Diagnosis *
                    </label>
                    <Input
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Enter primary diagnosis"
                      className="h-12 text-base border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Follow-up Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={followUpDate || ""}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Medications Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Pill className="w-5 h-5 text-blue-600" />
                      Medications
                    </label>
                    <span className="text-xs text-gray-500">
                      {medications.length} medication(s)
                    </span>
                  </div>

                  <div className="space-y-4">
                    {medications.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-blue-100 rounded-lg bg-blue-50/50"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                          <div className="lg:col-span-5">
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                              Medication Name
                            </label>
                            <Input
                              placeholder="e.g., Amoxicillin"
                              value={med.name}
                              onChange={(e) =>
                                handleMedicationChange(
                                  idx,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="border-blue-200 focus:border-blue-500"
                            />
                          </div>
                          <div className="lg:col-span-4">
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                              Dosage
                            </label>
                            <Input
                              placeholder="e.g., 1 tablet twice daily"
                              value={med.dosage}
                              onChange={(e) =>
                                handleMedicationChange(
                                  idx,
                                  "dosage",
                                  e.target.value
                                )
                              }
                              className="border-blue-200 focus:border-blue-500"
                            />
                          </div>
                          <div className="lg:col-span-2">
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                              Duration
                            </label>
                            <Input
                              placeholder="e.g., 7 days"
                              value={med.duration}
                              onChange={(e) =>
                                handleMedicationChange(
                                  idx,
                                  "duration",
                                  e.target.value
                                )
                              }
                              className="border-blue-200 focus:border-blue-500"
                            />
                          </div>
                          <div className="lg:col-span-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeMedication(idx)}
                              disabled={medications.length === 1}
                              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={addMedication}
                      variant="outline"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-dashed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </div>

                {/* Instructions and Notes in same row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Usage Instructions
                    </label>
                    <Textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Enter detailed usage instructions, precautions, and any special directions..."
                      rows={5}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Additional Notes (Optional)
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional notes, recommendations, or follow-up advice..."
                      rows={5}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-blue-100">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Prescription...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Save Prescription
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold py-3 text-base"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              This prescription will be electronically signed and stored in the
              patient's medical records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
