"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  ArrowLeft,
  Download,
  Printer,
  Pill
} from "lucide-react";

export default function CustomerPrescriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPrescription();
  }, [id]);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/appointment/prescriptions/${id}/`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        setError(text || `Failed to load prescription (${res.status})`);
        return;
      }

      const data = await res.json();
      const p = data.prescription || data;
      setPrescription(p);
    } catch (e) {
      console.error(e);
      setError("Failed to load prescription");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    console.log("Download prescription:", prescription);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#1656a4] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading prescription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prescription Not Found</h3>
            <p className="text-gray-600 mb-4">The prescription you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Prescription</h1>
              <p className="text-gray-600">Issued on {new Date(prescription.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#1656a4] hover:bg-[#1656a4]/90"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Prescription Card */}
        <Card className="border-2 border-[#1656a4]/20 shadow-lg">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8 border-b pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-[#1e40af] rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Medical Prescription</h2>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Valid Prescription
              </Badge>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Doctor Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Prescribing Doctor</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#1656a4]" />
                    <div>
                      <p className="font-medium">{prescription.doctor_name || prescription.doctor?.user?.name}</p>
                      <p className="text-sm text-gray-600">{prescription.doctor_specialty}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Patient Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{prescription.patient_name || prescription.patient?.name}</p>
                    <p className="text-sm text-gray-600">{prescription.patient_email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#1656a4]" />
                    <span className="text-sm">
                      {new Date(prescription.appointment_date).toLocaleDateString()} at {prescription.appointment_time}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Appointment ID: <span className="font-mono">{prescription.appointment_id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            {prescription.diagnosis && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Diagnosis</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800">{prescription.diagnosis}</p>
                </div>
              </div>
            )}

            {/* Medications */}
            {prescription.medications && prescription.medications.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#1656a4]" />
                  Medications
                </h3>
                <div className="space-y-3">
                  {prescription.medications.map((med: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-semibold text-blue-600">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {typeof med === 'string' ? med : med.name}
                          </h4>
                          {typeof med !== 'string' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">
                              {med.dosage}
                            </Badge>
                          )}
                        </div>
                        {typeof med !== 'string' && med.duration && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Duration:</span> {med.duration}
                          </p>
                        )}
                        {typeof med !== 'string' && med.instructions && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Instructions:</span> {med.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {prescription.instructions && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Instructions</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{prescription.instructions}</p>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {prescription.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Additional Notes</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 whitespace-pre-wrap">{prescription.notes}</p>
                </div>
              </div>
            )}

            {/* Follow-up */}
            {prescription.follow_up_date && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Appointment</h3>
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      {new Date(prescription.follow_up_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-green-600">Please schedule your follow-up appointment</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-6 mt-8 text-center">
              <p className="text-sm text-gray-500">
                This is an electronically generated prescription. No physical signature required.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Generated on {new Date(prescription.created_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}