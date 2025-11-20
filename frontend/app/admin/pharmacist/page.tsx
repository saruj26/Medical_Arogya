"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  Eye,
  Shield,
  Sparkles,
  Zap,
  Package,
  Building,
  MapPin,
} from "lucide-react";

import api from "@/lib/api";

export default function PharmacistsPage() {
  const [pharmacists, setPharmacists] = useState<any[]>([]);
  const [selectedPharmacist, setSelectedPharmacist] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPharmacists();
  }, []);

  const fetchPharmacists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api(`/api/doctor/pharmacists/`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.pharmacists || [];
        setPharmacists(list);
      }
    } catch (error) {
      console.error("Error fetching pharmacists:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: "Delete Pharmacist?",
      text: "This action will permanently remove the pharmacist from the system.",
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
      const response = await fetch(api(`/api/users/${id}/`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Pharmacist Deleted",
          text: "Pharmacist has been successfully removed from the system.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchPharmacists();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Unable to delete pharmacist. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting pharmacist:", error);
      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "An error occurred while deleting the pharmacist.",
      });
    }
  };

  const openPharmacistDetails = (pharmacist: any) => {
    setSelectedPharmacist(pharmacist);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPharmacist(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pharmacists Management</h2>
          <p className="text-gray-600 mt-1">
            Manage pharmacy professionals and their profiles
          </p>
        </div>
        <Link href="/admin/pharmacist/add">
          <Button className="bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Add New Pharmacist
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{pharmacists.length}</p>
                <p className="text-sm text-gray-600">Total Pharmacists</p>
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
                  {pharmacists.filter(p => p.is_active).length}
                </p>
                <p className="text-sm text-gray-600">Active Pharmacists</p>
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
                  {pharmacists.filter(p => !p.is_active).length}
                </p>
                <p className="text-sm text-gray-600">Inactive Accounts</p>
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
                  {new Set(pharmacists.map(p => p.pharmacy_name)).size}
                </p>
                <p className="text-sm text-gray-600">Pharmacies</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pharmacists Table */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            Pharmacy Professionals
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {pharmacists.length} pharmacists
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="text-left p-4 font-semibold text-gray-900">Pharmacist</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Pharmacy</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Contact</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Location</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pharmacists.map((pharmacist) => (
                  <tr key={pharmacist.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-gray-200">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white font-semibold">
                            {(pharmacist.name || "")
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{pharmacist.name}</p>
                          <p className="text-xs text-gray-500">ID: {pharmacist.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {pharmacist.pharmacy_name || "Not Specified"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-700">{pharmacist.email}</span>
                        </div>
                        {pharmacist.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-700">{pharmacist.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {pharmacist.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-700 line-clamp-1">{pharmacist.address}</span>
                          </div>
                        )}
                        {pharmacist.city && (
                          <div className="text-xs text-gray-500">
                            {pharmacist.city}
                            {pharmacist.state && `, ${pharmacist.state}`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={pharmacist.is_active ? "default" : "secondary"}
                        className={
                          pharmacist.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
                        }
                      >
                        {pharmacist.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPharmacistDetails(pharmacist)}
                          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => pharmacist.id && handleDelete(pharmacist.id)}
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

          {pharmacists.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">No pharmacists found</p>
              <p className="text-gray-500 text-sm mt-1">Add your first pharmacist to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pharmacist Details Modal */}
      {showModal && selectedPharmacist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
            style={{ maxHeight: '600px', height: '600px' }}
          >
            <div className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-4 border-white/30">
                      <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                        {(selectedPharmacist.name || "")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedPharmacist.name}</h3>
                      <p className="text-green-100">Pharmacy Professional</p>
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
                      <p><span className="font-medium">Pharmacist ID:</span> {selectedPharmacist.id}</p>
                      <p><span className="font-medium">Email:</span> {selectedPharmacist.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedPharmacist.phone || "Not provided"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Building className="w-4 h-4 text-green-600" />
                      Pharmacy Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Pharmacy:</span> {selectedPharmacist.pharmacy_name || "Not specified"}</p>
                      <p><span className="font-medium">License:</span> {selectedPharmacist.license_number || "Not provided"}</p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <Badge
                          variant={selectedPharmacist.is_active ? "default" : "secondary"}
                          className={
                            selectedPharmacist.is_active
                              ? "bg-green-100 text-green-800 ml-2"
                              : "bg-gray-100 text-gray-800 ml-2"
                          }
                        >
                          {selectedPharmacist.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Location Information
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium text-sm mb-2">Address:</p>
                      {selectedPharmacist.address ? (
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                          {selectedPharmacist.address}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">No address provided</p>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">City/State:</p>
                      <div className="space-y-1 text-sm">
                        {selectedPharmacist.city && (
                          <p className="text-gray-700">City: {selectedPharmacist.city}</p>
                        )}
                        {selectedPharmacist.state && (
                          <p className="text-gray-700">State: {selectedPharmacist.state}</p>
                        )}
                        {selectedPharmacist.zip_code && (
                          <p className="text-gray-700">ZIP: {selectedPharmacist.zip_code}</p>
                        )}
                        {!selectedPharmacist.city && !selectedPharmacist.state && (
                          <p className="text-sm text-gray-500">No location details</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {(selectedPharmacist.qualifications || selectedPharmacist.experience) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      Professional Information
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      {selectedPharmacist.qualifications && (
                        <div>
                          <p className="font-medium text-sm mb-2">Qualifications:</p>
                          <p className="text-sm text-gray-700">{selectedPharmacist.qualifications}</p>
                        </div>
                      )}
                      {selectedPharmacist.experience && (
                        <div>
                          <p className="font-medium text-sm mb-2">Experience:</p>
                          <p className="text-sm text-gray-700">{selectedPharmacist.experience}</p>
                        </div>
                      )}
                    </div>
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