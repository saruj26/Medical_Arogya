"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import TipCard from "@/components/tips/tip-card";
import Link from "next/link";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete tip",
      text: "Are you sure you want to delete this tip? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
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
          Swal.fire("Delete failed", j.message || JSON.stringify(j), "error");
        } else {
          const t = await res.text();
          Swal.fire("Delete failed", t || "Server error", "error");
        }
        return;
      }

      const d = await res.json();
      if (d.success) {
        setTips((p) => p.filter((t) => t.id !== id));
        Swal.fire("Deleted", "Tip deleted successfully", "success");
      } else {
        Swal.fire("Delete failed", d.message || "Failed to delete", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Delete failed", "Error deleting tip", "error");
    }
  };

  // Inline edit modal state
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editPublished, setEditPublished] = useState(true);

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
  };

  const handleUpdate = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Confirm update",
      text: "Save changes to this tip?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

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
          Swal.fire("Update failed", j.message || JSON.stringify(j), "error");
        } else {
          const t = await res.text();
          Swal.fire("Update failed", t || "Server error", "error");
        }
        return;
      }

      const data = await res.json();
      if (data.success) {
        setTips((prev) => prev.map((p) => (p.id === id ? data.tip : p)));
        closeEdit();
        Swal.fire("Saved", "Tip updated successfully", "success");
      } else {
        Swal.fire("Update failed", data.message || "Failed to update", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Update failed", "Unable to update tip", "error");
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">My Tips</h1>
          <Link href="/doctor/tips/create">
            <Button>+ New Tip</Button>
          </Link>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-3 py-2 border-b">Title</th>
                <th className="px-3 py-2 border-b">Tags</th>
                <th className="px-3 py-2 border-b">Published</th>
                <th className="px-3 py-2 border-b">Views</th>
                <th className="px-3 py-2 border-b">Created</th>
                <th className="px-3 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((t) => (
                <tr key={t.id} className="align-top hover:bg-gray-50">
                  <td className="px-3 py-3 align-top border-b">
                    <div className="font-medium text-sm truncate max-w-[320px]">
                      {t.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-[420px]">
                      {t.body}
                    </div>
                  </td>
                  <td className="px-3 py-3 border-b align-top">
                    <div className="text-xs text-muted-foreground">
                      {(t.tags || []).slice(0, 3).join(", ")}
                    </div>
                  </td>
                  <td className="px-3 py-3 border-b align-top">
                    <span
                      className={
                        t.is_published
                          ? "text-green-600 text-sm"
                          : "text-yellow-600 text-sm"
                      }
                    >
                      {t.is_published ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-3 py-3 border-b align-top">
                    {t.views ?? 0}
                  </td>
                  <td className="px-3 py-3 border-b align-top">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="px-3 py-3 border-b align-top">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline edit modal */}
      {editingTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />
          <div className="relative w-full max-w-2xl mx-auto p-4">
            <div className="bg-white rounded shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Edit Tip</h3>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Body</label>
                  <textarea
                    className="w-full rounded border px-3 py-2 min-h-[140px]"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                  />
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <input
                    id="edit-published"
                    type="checkbox"
                    checked={editPublished}
                    onChange={(e) => setEditPublished(e.target.checked)}
                  />
                  <label htmlFor="edit-published" className="text-sm">
                    Published
                  </label>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={closeEdit}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => editingTip && handleUpdate(editingTip.id)}
                  >
                    Save
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
