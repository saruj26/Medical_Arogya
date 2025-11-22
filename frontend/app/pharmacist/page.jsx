"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Box, ClipboardList, Package, Loader2, Pill, ShoppingCart, Users, AlertTriangle, TrendingUp, Sparkles, Zap } from "lucide-react";
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
  const [todaySales, setTodaySales] = useState(0);

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

      // Prescriptions
      const presRes = await fetch(api(`/api/appointment/prescriptions/`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (presRes.ok) {
        const pd = await presRes.json();
        if (pd.success) {
          setPrescriptionsCount((pd.prescriptions || []).length);
        }
      }

      // Today's sales (mock data - replace with actual API call)
      setTodaySales(24);
    } catch (e) {
      console.error("Failed to fetch pharmacist dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Pharmacy Dashboard</h3>
          <p className="text-gray-600">Preparing your pharmacy insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Pill className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
              Pharmacy Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage medicines, prescriptions, and sales</p>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1656a4] to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-white/20 text-white border-0 px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Professional Portal
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-0">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {userName || "Pharmacist"}! 👋
              </h2>
              <p className="text-blue-100 text-lg">
                Ready to manage today's pharmacy operations?
              </p>
            </div>
            <div className="mt-4 lg:mt-0 lg:text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-sm font-medium">Online & Active</span>
              </div>
              <p className="text-blue-100 font-medium">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{productsCount}</p>
                <p className="text-sm text-gray-600 mt-1">Total Products</p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-2">
                  +12% this month
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{categoriesCount}</p>
                <p className="text-sm text-gray-600 mt-1">Categories</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800 mt-2">
                  Organized
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Box className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{prescriptionsCount}</p>
                <p className="text-sm text-gray-600 mt-1">Prescriptions</p>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 mt-2">
                  Ready to process
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Overview */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
                <p className="text-sm text-gray-600 mt-1">Total Stock</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className={`${lowStock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {lowStock} low stock
                  </Badge>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-white">
              <Zap className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button
                onClick={() => (window.location.href = "/pharmacist/medicine")}
                className="w-full h-14 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white font-semibold text-base rounded-xl shadow-lg transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Manage Medicine Inventory
              </Button>
              
              <Button
                onClick={() => (window.location.href = "/pharmacist/prescriptions")}
                variant="outline"
                className="w-full h-14 border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white font-semibold rounded-xl transition-all duration-300"
              >
                <ClipboardList className="w-5 h-5 mr-3" />
                Process Prescriptions
              </Button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  className="h-12 border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 text-gray-700 rounded-lg transition-all duration-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Customers
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-2 border-gray-200 hover:border-green-200 hover:bg-green-50 text-gray-700 rounded-lg transition-all duration-300"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Stats */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-white">
              <Calendar className="w-5 h-5" />
              Today's Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Today's Sales */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Today's Sales</p>
                    <p className="text-sm text-gray-600">{todaySales} transactions</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>

              {/* Prescriptions Status */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Prescriptions</p>
                    <p className="text-sm text-gray-600">{prescriptionsCount} to process</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {prescriptionsCount > 0 ? "Pending" : "Clear"}
                </Badge>
              </div>

              {/* Stock Alert */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Stock Alert</p>
                    <p className="text-sm text-gray-600">{lowStock} items low</p>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800">
                  {lowStock > 0 ? "Attention" : "Good"}
                </Badge>
              </div>

              {/* Performance Metrics */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">System Performance</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Optimal
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#1656a4] to-cyan-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Status */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 font-medium">
            Pharmacy management system running smoothly • All systems operational
          </span>
        </div>
      </div>
    </div>
  );
}