"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorTipCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    if (role !== "doctor") {
      // not allowed, redirect to home
      if (typeof window !== "undefined") window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const bodyPayload = {
        title: title.trim(),
        body: body.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_published: isPublished,
      };

      const res = await fetch(api(`/api/doctor/tips/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(bodyPayload),
      });

      // Guard: server may return an HTML error page on 500; avoid calling
      // res.json() blindly which would throw "Unexpected token '<'". Handle
      // non-JSON responses gracefully.
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const errJson = await res.json();
          setError(errJson.message || errJson.error || JSON.stringify(errJson));
        } else {
          const text = await res.text();
          // Show a short snippet of the HTML/text error to help debugging
          setError(text ? text.slice(0, 1000) : "Server error");
        }
        return;
      }

      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // Unexpected but try to parse text
        const text = await res.text();
        setError(text || "Unexpected server response");
        return;
      }

      if (data.success) {
        // navigate to doctor tips list or detail
        router.push("/doctor/tips");
      } else {
        setError(data.message || "Failed to create tip");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to create tip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Write a Health Tip</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
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
                  Publish now
                </label>
              </div>

              {error && (
                <p className="text-sm text-destructive mb-4">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/doctor")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving…" : "Publish"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
