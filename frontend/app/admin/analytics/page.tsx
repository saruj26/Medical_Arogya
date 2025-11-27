"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/api";

type Overview = {
  success?: boolean;
  total_doctors?: number;
  total_appointments?: number;
  pending_payments?: number;
  total_revenue?: string | number;
};

type Stats = {
  success?: boolean;
  labels?: string[];
  counts?: number[];
  revenues?: number[];
  total_count?: number;
  total_revenue?: string | number;
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchOverview = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(api("/api/appointment/overview/"), {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (!res.ok) {
          setError(data?.message || "Failed to load overview");
          return;
        }
        setOverview(data);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to fetch overview");
      }
    };

    const fetchStats = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(api("/api/appointment/stats/?days=7"), {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (!res.ok) {
          setError(data?.message || "Failed to load stats");
          return;
        }
        setStats(data);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to fetch stats");
      }
    };

    Promise.all([fetchOverview(), fetchStats()]).finally(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const totalRevenue = overview ? Number(overview.total_revenue || 0) : 0;
  const pendingPayments = overview ? Number(overview.pending_payments || 0) : 0;
  const totalAppointments = overview
    ? Number(overview.total_appointments || 0)
    : 0;
  const totalDoctors = overview ? Number(overview.total_doctors || 0) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-LK').format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-24 mb-1" />
                <Skeleton className="h-3 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive overview of your clinic's performance and metrics
        </p>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/50 rounded-t-lg border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Revenue Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Total Revenue</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Pending Payments</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(pendingPayments)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Net Collected</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(totalRevenue - pendingPayments)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium">Total Appointments</span>
                <span className="font-semibold">{formatNumber(totalAppointments)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/50 rounded-t-lg border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              7-Day Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Total Appointments</span>
                <span className="font-semibold">{stats?.total_count ?? 0}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Average Daily</span>
                <span className="font-semibold text-blue-600">
                  {stats && stats.counts && stats.counts.length
                    ? Math.round(
                        (stats.counts.reduce((a, b) => a + b, 0) /
                          stats.counts.length) *
                          10
                      ) / 10
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Weekly Revenue</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(Number(stats?.total_revenue ?? 0))}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium">Daily Average Revenue</span>
                <span className="font-semibold text-green-600">
                  {stats && stats.revenues && stats.revenues.length
                    ? formatCurrency(
                        Math.round(
                          stats.revenues.reduce((a, b) => a + b, 0) /
                            stats.revenues.length
                        )
                      )
                    : formatCurrency(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}