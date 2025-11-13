"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorTipEditPage({ params }: any) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    if (role !== "doctor") {
      window.location.href = "/";
      return;
    }

    const fetchTip = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(api(`/api/doctor/tips/${id}/`), {
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
          setTitle(data.tip.title || "");
          setBody(data.tip.body || "");
          setTags((data.tip.tags || []).join(", "));
          setIsPublished(Boolean(data.tip.is_published));
        } else {
          setError(data.message || "Failed to load tip");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to fetch tip");
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: title.trim(),
        body: body.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_published: isPublished,
      };
      const res = await fetch(api(`/api/doctor/tips/${id}/`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
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
        router.push("/doctor/tips");
      } else {
        setError(data.message || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Tip</CardTitle>
          </CardHeader>

          <form onSubmit={handleSave}>
            <CardContent>
              {loading && <p>Loading…</p>}
              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  className="w-full rounded border px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Body</label>
                <textarea
                  className="w-full rounded border px-3 py-2 min-h-[140px]"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  className="w-full rounded border px-3 py-2"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="mb-4 flex items-center gap-3">
                <input
                  id="published"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <label htmlFor="published" className="text-sm">
                  Published
                </label>
              </div>
            </CardContent>

            <CardFooter>
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/doctor/tips")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
