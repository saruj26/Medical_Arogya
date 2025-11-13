"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import TipCard from "@/components/tips/tip-card";
import { MessageSquare, Shield } from "lucide-react";

type Tip = {
  id: number;
  title: string;
  body: string;
  tags?: string[];
  doctor_name?: string;
  doctor_id?: string;
  created_at?: string;
  views?: number;
};

export default function CustomerTipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchTips = async () => {
      try {
        setLoading(true);
        const res = await fetch(api(`/api/doctor/tips/`));
        const data = await res.json();
        if (!mounted) return;
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
    fetchTips();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 ">
        {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Health & Wellness Tips</h1>
                  <p className="text-sm text-gray-600">Expert medical care at your fingertips</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure & Confidential</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-3xl font-semibold bg-gradient-to-r from-blue-900 to-cyan-800 bg-clip-text text-transparent mb-2">
            Health & Wellness Tips
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Expert advice from healthcare professionals to help you maintain a
            healthy lifestyle
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex space-x-4 w-full max-w-2xl mx-auto">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center max-w-2xl mx-auto mb-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && tips.length === 0 && !error && (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Tips Available
            </h3>
            <p className="text-gray-600">
              Check back later for new health tips from our medical
              professionals.
            </p>
          </div>
        )}

        {/* Tips Grid */}
        {!loading && tips.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {tips.map((t) => (
              <TipCard key={t.id} tip={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
