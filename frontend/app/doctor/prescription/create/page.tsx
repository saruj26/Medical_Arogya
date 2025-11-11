"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
      const res = await fetch(api(`/api/appointment/appointments/${appointmentId}/`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
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

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        appointment: Number(appointmentId),
        medications,
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

      // On success navigate back to doctor's appointments or prescription detail
      router.push(`/doctor/appointments`);
    } catch (e) {
      console.error(e);
      setError("Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Create Prescription</h2>

      <Card>
        <CardContent>
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

          {appointment ? (
            <div className="mb-4">
              <p className="font-medium">Patient: {appointment.patient_name}</p>
              <p className="text-sm text-gray-600">Appointment ID: {appointment.appointment_id}</p>
              <p className="text-sm text-gray-600">Date: {new Date(appointment.appointment_date).toLocaleDateString()} {appointment.appointment_time}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mb-4">Loading appointment...</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Medications</label>
              <div className="space-y-2">
                {medications.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input placeholder="Name" value={med.name} onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)} />
                    </div>
                    <div className="col-span-4">
                      <Input placeholder="Dosage (e.g., 1 tablet twice daily)" value={med.dosage} onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <Input placeholder="Duration" value={med.duration} onChange={(e) => handleMedicationChange(idx, 'duration', e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <Button type="button" size="sm" variant={"destructive" as any} onClick={() => removeMedication(idx)}>Remove</Button>
                    </div>
                  </div>
                ))}

                <Button type="button" onClick={addMedication}>Add Medication</Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Instructions</label>
              <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Enter usage instructions" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Diagnosis</label>
              <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Follow-up date (optional)</label>
              <Input type="date" value={followUpDate || ""} onChange={(e) => setFollowUpDate(e.target.value)} />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-[#1656a4]" disabled={loading}>{loading ? "Saving..." : "Save Prescription"}</Button>
              <Button type="button" variant={"outline" as any} onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
