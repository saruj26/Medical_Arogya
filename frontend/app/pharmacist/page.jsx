"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Box, ClipboardList, Package, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function PharmacistDashboard() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  const [prescriptionsCount, setPrescriptionsCount] = useState(0);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    const name = localStorage.getItem("userName") || "";
    setUserEmail(email);
    setUserName(name || (email ? email.split("@")[0] : ""));

    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token)
        console.warn(
          "No auth token found in localStorage; API calls may be forbidden"
        );

      // Products summary
      const prodRes = await fetch(api(`/api/pharmacy/products/`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (prodRes.ok) {
        const data = await prodRes.json();
        if (data.success) {
          const meds = data.medicines || [];
          setProductsCount(meds.length);
          const cats = new Set(meds.map((m) => m.category?.id).filter(Boolean));
          setCategoriesCount(cats.size);
          const stock = meds.reduce(
            (s, m) => s + (Number(m.stock_count) || 0),
            0
          );
          setTotalStock(stock);
          setLowStock(
            meds.filter(
              (m) => Number(m.stock_count) > 0 && Number(m.stock_count) <= 5
            ).length
          );
        }
      }

      // Prescriptions (may return empty for pharmacist role if backend doesn't expose)
      const presRes = await fetch(api(`/api/appointment/prescriptions/`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (presRes.ok) {
        const pd = await presRes.json();
        if (pd.success) {
          setPrescriptionsCount((pd.prescriptions || []).length);
        }
      } else {
        if (presRes.status === 403) {
          console.warn(
            "Prescriptions fetch returned 403 Forbidden. Check backend permissions for pharmacist role or token validity."
          );
        } else {
          const text = await presRes
            .text()
            .catch(() => "[unable to read response]");
          console.warn("Prescriptions fetch failed:", presRes.status, text);
        }
      }
    } catch (e) {
      console.error("Failed to fetch pharmacist dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#1656a4] mx-auto" />
          <p className="text-gray-600 mt-2">Loading pharmacist dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1656a4] to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-2">
              <Package className="w-4 h-4" /> Pharmacist Portal
            </div>
            <h2 className="text-2xl font-bold">
              Welcome, {userName || "Pharmacist"}
            </h2>
            <p className="text-sm text-blue-100">
              Manage medicines and prescriptions
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{userEmail}</p>
            <p className="text-sm text-blue-100">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productsCount}</p>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categoriesCount}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{prescriptionsCount}</p>
                <p className="text-sm text-gray-600">Prescriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStock}</p>
                <p className="text-sm text-gray-600">Total Stock</p>
                <div className="text-xs text-amber-600 mt-1">
                  Low stock: {lowStock}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => (window.location.href = "/pharmacist/medicine")}
                className="w-full"
              >
                Manage Medicines
              </Button>
              <Button
                onClick={() =>
                  (window.location.href = "/pharmacist/prescriptions")
                }
                variant="outline"
                className="w-full"
              >
                View Prescriptions
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              No recent activity to show.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
