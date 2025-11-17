"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import TipCard from "@/components/tips/tip-card";
import Link from "next/link";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Search,
  Filter,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
} from "lucide-react";

type Tip = {
  id: number;
  title: string;
  body: string;
  tags?: string[];
  doctor_name?: string;
  doctor_id?: string;
  created_at?: string;
  views?: number;
  is_published?: boolean;
};

export default function DoctorTipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const fetchTips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/doctor/tips/?mine=1`), {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const j = await res.json();
          setError(j.message || JSON.stringify(j));
        } else {
          const t = await res.text();
          setError(t || "Server error");
        }
        return;
      }

      const data = await res.json();
      if (data.success) {
        setTips(data.tips || []);
      } else {
        setError(data.message || "Failed to load tips");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to fetch tips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    if (role !== "doctor") {
      window.location.href = "/";
      return;
    }
    fetchTips();
  }, []);

  // Filter tips based on search and status
  const filteredTips = tips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && tip.is_published) ||
      (statusFilter === "draft" && !tip.is_published);

    return matchesSearch && matchesStatus;
  });

  const truncateWords = (text: string | undefined, count = 6) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= count) return words.join(" ");
    return words.slice(0, count).join(" ") + "...";
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Health Tip",
      text: "Are you sure you want to delete this health tip? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      background: "#fff",
      customClass: {
        title: "text-lg font-semibold",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg",
        cancelButton:
          "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/doctor/tips/${id}/`), {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        if (ct.includes("application/json")) {
          const j = await res.json();
          Swal.fire("Delete Failed", j.message || JSON.stringify(j), "error");
        } else {
          const t = await res.text();
          Swal.fire("Delete Failed", t || "Server error", "error");
        }
        return;
      }

      const d = await res.json();
      if (d.success) {
        setTips((p) => p.filter((t) => t.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Health tip deleted successfully",
          icon: "success",
          confirmButtonColor: "#1656a4",
          background: "#fff",
          customClass: {
            title: "text-lg font-semibold",
          },
        });
      } else {
        Swal.fire("Delete Failed", d.message || "Failed to delete", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Delete Failed", "Error deleting health tip", "error");
    }
  };

  // Inline edit modal state
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editPublished, setEditPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const openEdit = (t: Tip) => {
    setEditingTip(t);
    setEditTitle(t.title || "");
    setEditBody(t.body || "");
    setEditTags((t.tags || []).join(", "));
    setEditPublished(Boolean(t.is_published));
  };

  const closeEdit = () => {
    setEditingTip(null);
    setEditTitle("");
    setEditBody("");
    setEditTags("");
    setEditPublished(true);
    setSaving(false);
  };

  const handleUpdate = async (id: number) => {
    if (!editTitle.trim() || !editBody.trim()) {
      Swal.fire("Validation Error", "Title and body are required", "warning");
      return;
    }

    setSaving(true);
    const confirm = await Swal.fire({
      title: "Update Health Tip",
      text: "Save changes to this health tip?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1656a4",
      background: "#fff",
      customClass: {
        title: "text-lg font-semibold",
      },
    });

    if (!confirm.isConfirmed) {
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: editTitle.trim(),
        body: editBody.trim(),
        tags: editTags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        is_published: editPublished,
      };

      const res = await fetch(api(`/api/doctor/tips/${id}/`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        if (ct.includes("application/json")) {
          const j = await res.json();
          Swal.fire("Update Failed", j.message || JSON.stringify(j), "error");
        } else {
          const t = await res.text();
          Swal.fire("Update Failed", t || "Server error", "error");
        }
        return;
      }

      const data = await res.json();
      if (data.success) {
        setTips((prev) => prev.map((p) => (p.id === id ? data.tip : p)));
        closeEdit();
        Swal.fire({
          title: "Updated!",
          text: "Health tip updated successfully",
          icon: "success",
          confirmButtonColor: "#1656a4",
          background: "#fff",
          customClass: {
            title: "text-lg font-semibold",
          },
        });
      } else {
        Swal.fire("Update Failed", data.message || "Failed to update", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Update Failed", "Unable to update health tip", "error");
    } finally {
      setSaving(false);
    }
  };

  // Stats calculation
  const stats = {
    total: tips.length,
    published: tips.filter((tip) => tip.is_published).length,
    drafts: tips.filter((tip) => !tip.is_published).length,
    totalViews: tips.reduce((sum, tip) => sum + (tip.views || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <FileText className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading your health tips...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              Health Tips Management
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage health tips to educate and engage with patients
            </p>
          </div>

          <Link href="/doctor/tips/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6">
              <Plus className="w-4 h-4 mr-2" />
              Create New Tip
            </Button>
          </Link>
        </div>

        {/* Tips Table */}
        <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  My Health Tips
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Manage and edit your published health tips and drafts
                </CardDescription>
              </div>

              {/* search + filters placed into header */}
              <div className="w-full lg:w-1/2">
                <div className="bg-white rounded-md p-3 shadow-sm flex flex-col lg:flex-row items-center gap-3">
                  <div className="flex-1 relative w-full">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search tips by title, content, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 border-gray-200 focus:border-blue-500 h-10 w-full"
                    />
                  </div>

                  <div className="flex-shrink-0 flex gap-2">
                    <Button
                      variant={statusFilter === "all" ? "default" : "outline"}
                      onClick={() => setStatusFilter("all")}
                      className={`${
                        statusFilter === "all"
                          ? "bg-blue-600 text-white"
                          : "border-blue-200 text-gray-700"
                      }`}
                    >
                      All Tips
                    </Button>
                    <Button
                      variant={
                        statusFilter === "published" ? "default" : "outline"
                      }
                      onClick={() => setStatusFilter("published")}
                      className={`${
                        statusFilter === "published"
                          ? "bg-green-600 text-white"
                          : "border-green-200 text-gray-700"
                      }`}
                    >
                      Published
                    </Button>
                    <Button
                      variant={statusFilter === "draft" ? "default" : "outline"}
                      onClick={() => setStatusFilter("draft")}
                      className={`${
                        statusFilter === "draft"
                          ? "bg-yellow-600 text-white"
                          : "border-yellow-200 text-gray-700"
                      }`}
                    >
                      Drafts
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {filteredTips.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tips found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first health tip"}
                </p>
                <Link href="/doctor/tips/create">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Tip
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 align-middle text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Health Tip
                      </th>
                      <th className="px-6 py-4 align-middle text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-4 py-4 align-middle text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-4 align-middle text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Views
                      </th>
                      <th className="px-4 py-4 align-middle text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Created
                      </th>
                      <th className="px-4 py-4 align-middle text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTips.map((tip) => (
                      <tr
                        key={tip.id}
                        className="hover:bg-blue-50 transition-colors align-middle"
                      >
                        <td className="px-6 py-4 align-middle">
                          <div className="max-w-md">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                              {tip.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {truncateWords(tip.body, 8)}
                            </p>
                          </div>
                        </td>
                        <td className="px-2 py-4 align-middle">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(tip.tags || []).slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {(tip.tags || []).length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(tip.tags || []).length - 3} more
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center align-middle">
                          <Badge
                            className={`
                              ${
                                tip.is_published
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                              }
                            `}
                          >
                            {tip.is_published ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Published
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Draft
                              </>
                            )}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-center w-24 align-middle">
                          <div className="text-sm text-gray-600 inline-flex items-center justify-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {tip.views ?? 0}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center w-28 align-middle">
                          <div className="text-sm text-gray-600">
                            {tip.created_at
                              ? new Date(tip.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center w-36 align-middle">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(tip)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(tip.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Edit Modal */}
      {editingTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/65" onClick={closeEdit} />
          <div className="relative w-full max-w-4xl mx-auto">
            <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Edit3 className="w-5 h-5" />
                  Edit Health Tip
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Update your health tip information and visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="edit-title" className="text-sm font-semibold">
                    Title *
                  </Label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Enter a compelling title for your health tip..."
                    className="border-blue-200 focus:border-blue-500 h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="edit-body" className="text-sm font-semibold">
                    Content *
                  </Label>
                  <Textarea
                    id="edit-body"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    placeholder="Write detailed health information, tips, and recommendations..."
                    rows={8}
                    className="border-blue-200 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="edit-tags" className="text-sm font-semibold">
                    Tags
                  </Label>
                  <Input
                    id="edit-tags"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Add relevant tags separated by commas (e.g., nutrition, exercise, wellness)"
                    className="border-blue-200 focus:border-blue-500 h-12"
                  />
                  <p className="text-xs text-gray-500">
                    Tags help patients discover your content more easily
                  </p>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Switch
                    id="edit-published"
                    checked={editPublished}
                    onCheckedChange={setEditPublished}
                  />
                  <Label
                    htmlFor="edit-published"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Publish this health tip
                  </Label>
                  <Badge
                    variant={editPublished ? "default" : "secondary"}
                    className="ml-auto"
                  >
                    {editPublished ? "Visible to patients" : "Draft mode"}
                  </Badge>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
                  <Button
                    variant="outline"
                    onClick={closeEdit}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => editingTip && handleUpdate(editingTip.id)}
                    disabled={saving || !editTitle.trim() || !editBody.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold min-w-24"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
