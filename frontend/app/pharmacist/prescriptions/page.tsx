"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Pill,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  ShoppingCart,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function PharmacistPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase().trim();
    const filtered = prescriptions.filter((p) => {
      // If not showing all, hide dispensed items
      if (!showAll && p.dispensed) return false;
      if (!lower) return true;
      return (
        p.patient_name?.toLowerCase().includes(lower) ||
        p.patient_email?.toLowerCase().includes(lower) ||
        (p.patient_phone || "").toString().toLowerCase().includes(lower) ||
        p.appointment_id?.toString().includes(lower)
      );
    });
    setFilteredPrescriptions(filtered);
  }, [searchTerm, prescriptions, showAll]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        api(`/api/appointment/prescriptions/pharmacist/`),
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) {
        console.error("Failed to fetch prescriptions", res.status);
        return;
      }
      const data = await res.json();
      if (data.success) setPrescriptions(data.prescriptions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markDispensed = async (id: number, saleId?: number | null) => {
    const conf = await Swal.fire({
      title: "Mark as Dispensed?",
      text: "Are you sure you want to mark this prescription as dispensed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Mark Dispensed",
      confirmButtonColor: "#1656a4",
      cancelButtonColor: "#6b7280",
      background: "#f8fafc",
    });
    if (!conf.isConfirmed) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        api(`/api/appointment/prescriptions/${id}/dispense/`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ dispensed: true, sale_id: saleId || null }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        await Swal.fire({
          icon: "success",
          title: "Prescription Dispensed",
          text: data.message || "Prescription has been marked as dispensed",
          background: "#f0fdf4",
          color: "#166534",
        });
        fetchPrescriptions();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed to Mark Dispensed",
          text: data.message || JSON.stringify(data),
          background: "#fef2f2",
          color: "#dc2626",
        });
      }
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error marking prescription as dispensed",
        background: "#fef2f2",
        color: "#dc2626",
      });
    } finally {
      setProcessing(false);
    }
  };

  const createSaleFromPrescription = async (prescription: any) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const prodRes = await fetch(api(`/api/pharmacy/products/`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!prodRes.ok) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to load products to map medications to products",
          background: "#fef2f2",
          color: "#dc2626",
        });
        return;
      }
      const prodData = await prodRes.json();
      const products = prodData.medicines || prodData.products || [];

      const items: any[] = [];
      const unmapped: string[] = [];
      (prescription.medications || []).forEach((m: any) => {
        const name = (m.name || "").toString().trim().toLowerCase();
        if (!name) return;
        const found = products.find(
          (p: any) => (p.name || "").toString().trim().toLowerCase() === name
        );
        if (found) {
          items.push({ product_id: found.id, qty: 1 });
        } else {
          unmapped.push(m.name || "(unknown)");
        }
      });

      if (items.length === 0) {
        await Swal.fire({
          icon: "info",
          title: "No Products Found",
          text: "No matching products found for this prescription. Please map items manually in the Billing page.",
          background: "#f0f9ff",
          color: "#0369a1",
        });
        return;
      }

      const payload = {
        customer_name: prescription.patient_name || "",
        phone: prescription.patient_phone || "",
        payment_method: "cash",
        items,
      };

      const saleRes = await fetch(api(`/api/pharmacy/sales/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const saleData = await saleRes.json().catch(() => ({}));
      if (saleRes.ok && saleData.success) {
        await Swal.fire({
          icon: "success",
          title: "Sale Created Successfully",
          text:
            "Sale created from prescription" +
            (unmapped.length
              ? ". Unmapped medications: " + unmapped.join(", ")
              : ""),
          background: "#f0fdf4",
          color: "#166534",
        });
        await markDispensed(prescription.id, saleData.sale?.id || null);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Sale Creation Failed",
          text:
            "Failed to create sale: " +
            (saleData.message || JSON.stringify(saleData.errors || saleData)),
          background: "#fef2f2",
          color: "#dc2626",
        });
      }
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error creating sale from prescription",
        background: "#fef2f2",
        color: "#dc2626",
      });
    } finally {
      setProcessing(false);
    }
  };

 const openInBilling = (prescription: any) => {
  const draft = {
    prescription_id: prescription.id,
    patient_name: prescription.patient_name || "",
    phone: prescription.patient_phone || prescription.patient_email || "",
    medications: prescription.medications || [],
  };
  try {
    localStorage.setItem("draftPrescriptionSale", JSON.stringify(draft));
    window.location.href = "/pharmacist/medicine";
  } catch (e) {
    console.error("Failed to open in billing", e);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Unable to open billing page",
      background: "#fef2f2",
      color: "#dc2626",
    });
  }
};
  const openModal = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
              Prescription Management
            </h1>
            <p className="text-gray-600">
              Manage and process patient prescriptions
            </p>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by patient name, email, phone, or appointment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
              />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Show all</span>
              </label>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Total: {prescriptions.length}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Dispensed: {prescriptions.filter((p) => p.dispensed).length}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800"
              >
                Pending: {prescriptions.filter((p) => !p.dispensed).length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-[#1656a4] border-t-transparent rounded-full animate-spin" />
            Loading prescriptions...
          </div>
        </div>
      )}

      {!loading && filteredPrescriptions.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Prescriptions Found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "No prescriptions match your search criteria."
                : "No prescriptions available at the moment."}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredPrescriptions.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Patient Info
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Appointment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Medications
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPrescriptions.map((prescription) => (
                    <tr
                      key={prescription.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-[#1656a4]" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {prescription.patient_name || "N/A"}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              {prescription.patient_phone || "No phone"}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              {prescription.patient_email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium">
                            ID: {prescription.appointment_id}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {prescription.appointment_date}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3 h-3" />
                            {prescription.appointment_time}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium">
                            {(prescription.medications || []).length}{" "}
                            medications
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-2">
                            {(prescription.medications || [])
                              .map((m: any) => m.name)
                              .join(", ")}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {prescription.dispensed ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" />
                            Dispensed
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal(prescription)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openInBilling(prescription)}
                            disabled={prescription.dispensed}
                            className="flex items-center gap-1 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Bill
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              prescription.dispensed ? "outline" : "default"
                            }
                            disabled={processing || prescription.dispensed}
                            onClick={() => markDispensed(prescription.id)}
                            className="flex items-center gap-1"
                          >
                            <Pill className="w-4 h-4" />
                            {prescription.dispensed ? "Dispensed" : "Dispense"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescription Detail Modal */}
      {showModal && selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[600px] overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1656a4] to-cyan-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Prescription Details</h2>
                    <p className="text-blue-100 text-sm">
                      Appointment ID: {selectedPrescription.appointment_id}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[700px] overflow-y-auto">
              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#1656a4]" />
                      Patient Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedPrescription.patient_name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedPrescription.patient_phone || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedPrescription.patient_email || "N/A"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-cyan-50 border-cyan-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      Appointment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {selectedPrescription.appointment_date || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>{" "}
                        {selectedPrescription.appointment_time || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        <Badge
                          className={
                            selectedPrescription.dispensed
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {selectedPrescription.dispensed
                            ? "Dispensed"
                            : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Medications */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Pill className="w-5 h-5 text-[#1656a4]" />
                    Prescribed Medications (
                    {selectedPrescription.medications?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(selectedPrescription.medications || []).map(
                      (medication: any, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">
                                {medication.name}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 space-y-1">
                                <div>
                                  <span className="font-medium">Dosage:</span>{" "}
                                  {medication.dosage || "Not specified"}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span>{" "}
                                  {medication.duration || "Not specified"}
                                </div>
                                {medication.instructions && (
                                  <div>
                                    <span className="font-medium">
                                      Instructions:
                                    </span>{" "}
                                    {medication.instructions}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    openInBilling(selectedPrescription);
                  }}
                  disabled={selectedPrescription.dispensed}
                  className="bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Process in Billing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
