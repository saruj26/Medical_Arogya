"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
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
  Pill,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function PrescriptionDetailPage() {
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

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        api(`/api/appointment/prescriptions/${id}/download/`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `prescription-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Download failed",
          text: "Failed to download prescription",
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      await Swal.fire({
        icon: "error",
        title: "Download failed",
        text: "Error downloading prescription",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">
            Loading prescription details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Prescription
            </h3>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>
            <Button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Prescription Not Found
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              The prescription you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const prescriptionDate = new Date(prescription.created_at);
  const appointmentDate = new Date(prescription.appointment_date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 print:bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Main Prescription Card */}
        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-8">
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b-2 border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Medical Prescription
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Badge className="bg-green-100 text-green-800 border-0">
                      Valid & Active
                    </Badge>
                    <span className="text-sm text-gray-600">
                      •{" "}
                      {prescriptionDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Prescription ID</p>
                <p className="text-lg font-mono font-semibold text-blue-600">
                  #{prescription.id}
                </p>
              </div>
            </div>

            {/* Two Column Layout - Doctor & Patient Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Doctor Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                  Prescribing Physician
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        Dr. {prescription.doctor_name ||
                          prescription.doctor?.user?.name ||
                          "Dr. Name"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {prescription.doctor_specialty ||
                          "General Practitioner"}
                      </p>
                      {prescription.doctor_license && (
                        <p className="text-xs text-gray-500 mt-1">
                          License: {prescription.doctor_license}
                        </p>
                      )}
                    </div>
                  </div>
                  {prescription.clinic_name && (
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {prescription.clinic_name}
                        </p>
                        {prescription.clinic_address && (
                          <p className="text-xs text-gray-600">
                            {prescription.clinic_address}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {prescription.doctor_contact && (
                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        {prescription.doctor_contact}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                  Patient Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {prescription.patient_name ||
                        prescription.patient?.name ||
                        "Patient Name"}
                    </p>
                    {prescription.patient_age && (
                      <p className="text-sm text-gray-600 mt-1">
                        Age: {prescription.patient_age} years
                      </p>
                    )}
                    {prescription.patient_gender && (
                      <p className="text-sm text-gray-600">
                        Gender: {prescription.patient_gender}
                      </p>
                    )}
                  </div>
                  {prescription.patient_email && (
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        {prescription.patient_email}
                      </p>
                    </div>
                  )}
                  {prescription.patient_phone && (
                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        {prescription.patient_phone}
                      </p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Appointment ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {prescription.appointment_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase">
                  Appointment Date
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-gray-900">
                    {appointmentDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase">
                  Appointment Time
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-gray-900">
                    {prescription.appointment_time || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase">
                  Prescription Date
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-gray-900">
                    {prescriptionDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnosis Section */}
            {prescription.diagnosis && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Clinical Diagnosis
                </h3>
                <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <p className="text-gray-900 font-medium">
                    {prescription.diagnosis}
                  </p>
                </div>
              </div>
            )}

            {/* Allergies & Contraindications */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {prescription.allergies && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    ⚠️ Known Allergies
                  </h3>
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-900">
                    {prescription.allergies}
                  </div>
                </div>
              )}
              {prescription.contraindications && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    ⚠️ Contraindications
                  </h3>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-900">
                    {prescription.contraindications}
                  </div>
                </div>
              )}
            </div>

            {/* Medications Section */}
            {prescription.medications &&
              prescription.medications.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-600" />
                    Prescribed Medications
                  </h3>
                  <div className="space-y-3">
                    {prescription.medications.map((med: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-blue-700 text-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 text-base">
                                {typeof med === "string"
                                  ? med
                                  : med.name || med}
                              </h4>
                              {typeof med !== "string" && med.dosage && (
                                <Badge
                                  variant="outline"
                                  className="w-fit bg-blue-50 text-blue-700 border-blue-300"
                                >
                                  {med.dosage}
                                </Badge>
                              )}
                            </div>

                            {typeof med !== "string" && (
                              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                {med.frequency && (
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      Frequency:
                                    </span>
                                    <p className="text-gray-600">
                                      {med.frequency}
                                    </p>
                                  </div>
                                )}
                                {med.duration && (
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      Duration:
                                    </span>
                                    <p className="text-gray-600">
                                      {med.duration}
                                    </p>
                                  </div>
                                )}
                                {med.route && (
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      Route:
                                    </span>
                                    <p className="text-gray-600">{med.route}</p>
                                  </div>
                                )}
                                {med.refills && (
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      Refills:
                                    </span>
                                    <p className="text-gray-600">
                                      {med.refills}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {typeof med !== "string" && med.instructions && (
                              <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                <span className="font-medium">
                                  Instructions:
                                </span>{" "}
                                {med.instructions}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Clinical Instructions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {prescription.instructions && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Patient Instructions
                  </h3>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {prescription.instructions}
                  </div>
                </div>
              )}
              {prescription.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Additional Notes
                  </h3>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
                    {prescription.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Follow-up Section */}
            {prescription.follow_up_date && (
              <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase mb-1">
                      Follow-up Appointment
                    </h3>
                    <p className="text-green-900 font-medium">
                      {new Date(prescription.follow_up_date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Please schedule your follow-up appointment as recommended
                      by your physician.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validity & Footer */}
            <div className="border-t-2 border-gray-200 pt-6 mt-8">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Validity Status
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800 border-0 mx-auto">
                    Valid & Active
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Issued
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {prescriptionDate.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Prescription #
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-900 mt-2">
                    {prescription.id}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 text-center space-y-1">
                <p className="text-xs text-gray-600">
                  ✓ This is an electronically generated prescription. No
                  physical signature required.
                </p>
                <p className="text-xs text-gray-500">
                  For inquiries, please contact your healthcare provider or the
                  issuing clinic.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="text-center mt-6 text-xs text-gray-500 print:mt-4">
          <p>Medical Prescription Management System • Patient Copy</p>
        </div>
      </div>
    </div>
  );
}
