"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  Edit,
  Trash2,
  RotateCcw,
  Upload,
  Pill,
  FolderPlus,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/api";

export default function MedicineAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [catName, setCatName] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    id: null,
    name: "",
    category_id: null,
    brand: "",
    measureType: "weight",
    measureValue: "",
    measureUnit: "mg",
    stock_count: 0,
    description: "",
    image: null,
  });

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchMedicines();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/pharmacy/categories/`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await fetch(api(`/api/pharmacy/products/`));
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setMedicines(data.medicines || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!catName.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Category Name Required",
        text: "Please enter a category name",
        confirmButtonColor: "#1656a4",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/pharmacy/categories/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: catName }),
      });
      const data = await res.json();
      if (data.success) {
        setCatName("");
        fetchCategories();
        await Swal.fire({
          icon: "success",
          title: "Category Added",
          text: "New category has been created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: data.message || JSON.stringify(data),
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Unable to create category",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleFileChange = (e: any) => {
    setForm({ ...form, image: e.target.files?.[0] || null });
  };

  const handleSaveMedicine = async () => {
    if (!form.name) {
      await Swal.fire({
        icon: "warning",
        title: "Validation Required",
        text: "Medicine name is required",
        confirmButtonColor: "#1656a4",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      if (form.name) fd.append("name", form.name);
      if (form.category_id) fd.append("category_id", String(form.category_id));
      if (form.brand) fd.append("brand", form.brand);
      
      if (form.measureValue) {
        const unit = form.measureUnit || (form.measureType === "volume" ? "ml" : "mg");
        fd.append("weight_or_volume", `${form.measureValue}${unit}`);
      }
      
      fd.append("stock_count", String(form.stock_count || 0));
      if (form.description) fd.append("description", form.description);
      if (form.image) fd.append("image", form.image);

      const url = form.id
        ? api(`/api/pharmacy/products/${form.id}/`)
        : api(`/api/pharmacy/products/`);
      const method = form.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: form.id ? "Medicine Updated" : "Medicine Added",
          text: form.id 
            ? "Medicine details have been updated successfully"
            : "New medicine has been added to the inventory",
          timer: 2000,
          showConfirmButton: false,
        });
        
        resetForm();
        fetchMedicines();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: JSON.stringify(data.errors || data.message || data),
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Unable to save medicine. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      category_id: null,
      brand: "",
      measureType: "weight",
      measureValue: "",
      measureUnit: "mg",
      stock_count: 0,
      description: "",
      image: null,
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEdit = (m: any) => {
    let measureType = "weight";
    let measureValue = "";
    let measureUnit = "mg";
    
    try {
      const w = (m.weight_or_volume || "").toString().trim();
      if (w) {
        const lower = w.toLowerCase();
        if (lower.includes("ml") || lower.includes("l")) {
          measureType = "volume";
          if (lower.includes("ml")) measureUnit = "ml";
          else measureUnit = "L";
        } else {
          measureType = "weight";
          if (lower.includes("mg")) measureUnit = "mg";
          else if (lower.includes("g")) measureUnit = "g";
          else if (lower.includes("mcg")) measureUnit = "mcg";
        }

        const num = w.match(/\d+(\.\d+)?/);
        if (num) measureValue = num[0];
      }
    } catch (e) {
      // ignore parse errors
    }

    setForm({
      id: m.id,
      name: m.name,
      category_id: m.category?.id || null,
      brand: m.brand || "",
      measureType,
      measureValue,
      measureUnit,
      stock_count: m.stock_count || 0,
      description: m.description || "",
      image: null,
    });
    
    if (fileRef.current) fileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: "Delete Medicine?",
      text: "This action will permanently remove the medicine from inventory.",
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
      const r = await fetch(api(`/api/pharmacy/products/${id}/`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (r.ok) {
        await Swal.fire({
          icon: "success",
          title: "Medicine Deleted",
          text: "Medicine has been removed from inventory",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchMedicines();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Unable to delete medicine",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "An error occurred while deleting",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" };
    if (stock <= 10) return { label: "Low Stock", color: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "In Stock", color: "bg-green-100 text-green-800 border-green-200" };
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicine Management</h2>
          <p className="text-gray-600 mt-1">
            Manage medicine inventory, categories, and product details
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {medicines.length} Medicines
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
                <p className="text-sm text-gray-600">Total Medicines</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {medicines.filter(m => m.stock_count === 0).length}
                </p>
                <p className="text-sm text-gray-600">Out of Stock</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {medicines.filter(m => m.stock_count > 0 && m.stock_count <= 10).length}
                </p>
                <p className="text-sm text-gray-600">Low Stock</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Categories Card */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-white" />
              </div>
              Manage Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoryName" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Add New Category
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="categoryName"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl"
                  />
                  <Button 
                    onClick={handleAddCategory}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/90 hover:to-emerald-600/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {categories.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Existing Categories
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category.id} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medicine Form Card */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              {form.id ? "Edit Medicine" : "Add New Medicine"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medicineName" className="text-sm font-semibold text-gray-700">
                    Medicine Name *
                  </Label>
                  <Input
                    id="medicineName"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter medicine name"
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={form.category_id ?? ""}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-2"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-semibold text-gray-700">
                  Brand / Company
                </Label>
                <Input
                  id="brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Enter brand name"
                  className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Measurement
                </Label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="measureType"
                      value="weight"
                      checked={form.measureType === "weight"}
                      onChange={() => setForm({ ...form, measureType: "weight", measureUnit: "mg" })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Weight</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="measureType"
                      value="volume"
                      checked={form.measureType === "volume"}
                      onChange={() => setForm({ ...form, measureType: "volume", measureUnit: "ml" })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Volume</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder={form.measureType === "weight" ? "e.g. 500" : "e.g. 5"}
                    value={form.measureValue}
                    onChange={(e) => setForm({ ...form, measureValue: e.target.value })}
                    className="flex-1 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                  />
                  <select
                    value={form.measureUnit}
                    onChange={(e) => setForm({ ...form, measureUnit: e.target.value })}
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-2"
                  >
                    {form.measureType === "weight" ? (
                      <>
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="mcg">mcg</option>
                      </>
                    ) : (
                      <>
                        <option value="ml">ml</option>
                        <option value="L">L</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">
                    Stock Count
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="Enter stock quantity"
                    value={form.stock_count}
                    onChange={(e) => setForm({ ...form, stock_count: Number(e.target.value) })}
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-semibold text-gray-700">
                    Medicine Image
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      ref={fileRef}
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter medicine description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                  disabled={loading}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleSaveMedicine}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-500/90 hover:to-cyan-600/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {form.id ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {form.id ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {form.id ? "Update Medicine" : "Add Medicine"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50/50 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            Medicine Inventory
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {medicines.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="text-left p-4 font-semibold text-gray-900">Image</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Medicine</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Brand</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Measurement</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Stock</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => {
                  const stockStatus = getStockStatus(medicine.stock_count);
                  return (
                    <tr key={medicine.id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        {medicine.image ? (
                          <img
                            src={medicine.image}
                            className="w-16 h-12 object-cover rounded-lg border border-gray-200"
                            alt={medicine.name}
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <Pill className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-gray-900">{medicine.name}</p>
                          {medicine.description && (
                            <p className="text-xs text-gray-500 line-clamp-1">{medicine.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {medicine.category?.name || "Uncategorized"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700">{medicine.brand || "-"}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700">{medicine.weight_or_volume || "-"}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{medicine.stock_count}</span>
                          <Badge variant="outline" className={stockStatus.color}>
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(medicine)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(medicine.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {medicines.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg font-medium">No medicines found</p>
                <p className="text-gray-500 text-sm mt-1">Add your first medicine to get started</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading medicines...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}