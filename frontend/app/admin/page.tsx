"use client";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Package, 
  TrendingUp,
  Activity,
  Shield,
  Sparkles,
  Zap,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  LineChart as LineChartIcon
} from "lucide-react";

// Small inline SVG chart helpers (no external deps)
function BarChart({
  labels,
  values,
  height = 80,
}: {
  labels: string[];
  values: number[];
  height?: number;
}) {
  const max = Math.max(...values, 1);
  const barWidth = Math.max(6, Math.floor(600 / Math.max(1, labels.length)));
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${labels.length * barWidth} ${height}`}
      preserveAspectRatio="none"
    >
      {values.map((v, i) => {
        const barHeight = Math.round((v / max) * (height - 20));
        const x = i * barWidth + 4;
        const y = height - barHeight - 10;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth - 8}
              height={barHeight}
              rx={4}
              fill="url(#barGradient)"
            />
            <text
              x={x + (barWidth - 8) / 2}
              y={height - 2}
              fontSize={10}
              fill="#374151"
              textAnchor="middle"
            >
              {labels[i].slice(5)}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LineChart({
  labels,
  values,
  height = 100,
}: {
  labels: string[];
  values: number[];
  height?: number;
}) {
  const max = Math.max(...values, 1);
  const w = Math.max(200, labels.length * 40);
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(1, labels.length - 1)) * (w - 20) + 10;
      const y = height - 10 - (v / max) * (height - 30);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#lineGradient)" strokeWidth={3} points={points} />
      {values.map((v, i) => {
        const x = (i / Math.max(1, labels.length - 1)) * (w - 20) + 10;
        const y = height - 10 - (v / max) * (height - 30);
        return <circle key={i} cx={x} cy={y} r={4} fill="#7c3aed" />;
      })}
    </svg>
  );
}

export default function AdminDashboard() {
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [stats, setStats] = useState<{
    labels: string[];
    counts: number[];
    revenues: number[];
    total_count?: number;
    total_revenue?: string;
  } | null>(null);
  const [overview, setOverview] = useState<{
    total_doctors?: number;
    total_appointments?: number;
    total_revenue?: string;
    pending_payments?: number;
  } | null>(null);
  const [productsSummary, setProductsSummary] = useState<{
    total_products: number;
    total_categories: number;
    total_stock: number;
    low_stock: number;
    out_of_stock: number;
  } | null>(null);
  const [customerStats, setCustomerStats] = useState<{
    total_customers: number;
    active_today: number;
    new_this_week: number;
    satisfaction_rate: number;
  } | null>(null);

  useEffect(() => {
    fetchDoctorsCount();
    fetchStats();
    fetchOverview();
    fetchProductsSummary();
    fetchCustomerStats();
  }, []);

  const fetchDoctorsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api(`/api/doctor/doctors/`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.doctors || [];
        setDoctorsCount(list.length);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchProductsSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/pharmacy/products/`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success) return;
      const meds = data.medicines || [];
      const total_products = meds.length;
      const categories = new Set(
        meds.map((m: any) => m.category?.id).filter(Boolean)
      );
      const total_categories = categories.size;
      const total_stock = meds.reduce(
        (s: number, m: any) => s + (Number(m.stock_count) || 0),
        0
      );
      const low_stock = meds.filter(
        (m: any) => Number(m.stock_count) > 0 && Number(m.stock_count) <= 5
      ).length;
      const out_of_stock = meds.filter(
        (m: any) => Number(m.stock_count) <= 0
      ).length;

      setProductsSummary({
        total_products,
        total_categories,
        total_stock,
        low_stock,
        out_of_stock,
      });
    } catch (e) {
      console.error("Failed to fetch products summary", e);
    }
  };

  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/appointment/overview/`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setOverview({
          total_doctors: data.total_doctors,
          total_appointments: data.total_appointments,
          pending_payments: data.pending_payments,
          total_revenue: data.total_revenue,
        });
        if (typeof data.total_doctors === "number")
          setDoctorsCount(data.total_doctors);
      }
    } catch (e) {
      console.error("Failed to fetch overview", e);
    }
  };

  const fetchCustomerStats = async () => {
    try {
      // Mock customer stats - replace with actual API call
      setCustomerStats({
        total_customers: 1250,
        active_today: 89,
        new_this_week: 45,
        satisfaction_rate: 94.2
      });
    } catch (e) {
      console.error("Failed to fetch customer stats", e);
    }
  };

  const fetchStats = async (days = 7) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/appointment/stats/?days=${days}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setStats({
          labels: data.labels || [],
          counts: data.counts || [],
          revenues: (data.revenues || []).map((r: any) => Number(r)),
          total_count: data.total_count,
          total_revenue: data.total_revenue,
        });
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    description,
    gradient 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    description?: string;
    gradient: string;
  }) => (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">{trend}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
          <div className={`w-14 h-14 ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1656a4] to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/30">
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </div>
            <h1 className="text-3xl font-bold mb-2">System Overview</h1>
            <p className="text-blue-100 text-lg">
              Monitor your healthcare platform performance and analytics
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Activity className="w-4 h-4" />
              Real-time Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Doctors"
          value={doctorsCount}
          icon={Users}
          trend="+12% this month"
          gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        
        <StatCard
          title="Total Appointments"
          value={overview?.total_appointments ?? stats?.total_count ?? 0}
          icon={Calendar}
          trend="+8% this week"
          gradient="bg-gradient-to-br from-green-500 to-emerald-500"
        />
        
        <StatCard
          title="Total Revenue"
          value={`Rs ${overview?.total_revenue ?? stats?.total_revenue ?? "0"}`}
          icon={DollarSign}
          trend="+15% growth"
          gradient="bg-gradient-to-br from-purple-500 to-pink-500"
        />
        
        <StatCard
          title="Pending Payments"
          value={overview?.pending_payments ?? 0}
          icon={CreditCard}
          description="Requires attention"
          gradient="bg-gradient-to-br from-orange-500 to-amber-500"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              Appointments Analytics (7 Days)
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.total_count ?? 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Appointments</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Growing</span>
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                {stats ? (
                  <BarChart
                    labels={stats.labels}
                    values={stats.counts}
                    height={120}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading analytics...
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50/50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <LineChartIcon className="w-5 h-5 text-white" />
              </div>
              Revenue Analytics (7 Days)
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Real-time
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    Rs {stats?.total_revenue ?? "0"}
                  </p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+15.2%</span>
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                {stats ? (
                  <LineChart
                    labels={stats.labels}
                    values={stats.revenues}
                    height={120}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading revenue data...
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Quick Analysis */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden lg:col-span-1">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              Pharmacy Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {productsSummary?.total_products ?? 0}
                </p>
                <p className="text-gray-600">Total Products</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-blue-600">{productsSummary?.total_categories ?? 0}</p>
                  <p className="text-xs text-blue-700">Categories</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-green-600">{productsSummary?.total_stock ?? 0}</p>
                  <p className="text-xs text-green-700">In Stock</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Low Stock Items</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {productsSummary?.low_stock ?? 0} items
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Out of Stock</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {productsSummary?.out_of_stock ?? 0} items
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Monitor stock levels regularly</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Analysis */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50/50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Customer Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {customerStats?.total_customers ?? 0}
                </p>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">+5.3%</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {customerStats?.active_today ?? 0}
                </p>
                <p className="text-gray-600 text-sm">Active Today</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    Live
                  </Badge>
                </div>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {customerStats?.new_this_week ?? 0}
                </p>
                <p className="text-gray-600 text-sm">New This Week</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-blue-600">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs">Growing</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {customerStats?.satisfaction_rate ?? 0}%
                </p>
                <p className="text-gray-600 text-sm">Satisfaction Rate</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-amber-600">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-xs">Excellent</span>
                </div>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">Customer Insights</p>
                  <p className="text-xs text-blue-600">
                    High engagement with 94% satisfaction rate. Focus on retention strategies.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
            <Activity className="w-6 h-6 text-green-600" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">API Services</p>
              <p className="text-xs text-gray-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">Database</p>
              <p className="text-xs text-gray-600">Healthy</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">Payments</p>
              <p className="text-xs text-gray-600">Active</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">Security</p>
              <p className="text-xs text-gray-600">Protected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}