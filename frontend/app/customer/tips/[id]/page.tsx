"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TipDetailPage({ params }: any) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tip, setTip] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const fetchTip = async () => {
      try {
        setLoading(true);
        const res = await fetch(api(`/api/doctor/tips/${id}/`));
        const ct = res.headers.get("content-type") || "";
        if (!res.ok) {
          if (ct.includes("application/json")) {
            const j = await res.json();
            setError(j.message || JSON.stringify(j));
          } else {
            const t = await res.text();
            setError(t || "Server error");
          }
          return;
        }

        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            if (!mounted) return;
            setTip(data.tip);
          } else {
            setError(data.message || "Failed to load tip");
          }
        } else {
          const t = await res.text();
          setError(t || "Unexpected response");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to fetch tip");
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="p-4">
        <p>Loading…</p>
      </div>
    );
  if (error)
    return (
      <div className="p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  if (!tip)
    return (
      <div className="p-4">
        <p>No tip found.</p>
      </div>
    );

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{tip.title}</CardTitle>
            <CardDescription className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                By {tip.doctor_name || "—"}
              </span>
              <span className="text-sm text-muted-foreground">
                {tip.created_at
                  ? new Date(tip.created_at).toLocaleDateString()
                  : ""}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>{tip.body}</p>
            </div>

            {tip.tags && tip.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tip.tags.map((t: string) => (
                  <span key={t} className="text-xs bg-muted px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
