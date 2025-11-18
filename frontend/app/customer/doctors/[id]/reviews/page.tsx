"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  ArrowLeft,
  Loader2,
  Calendar,
  MapPin,
  Award,
  Clock,
} from "lucide-react";

interface Review {
  id: number;
  user_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  hospital: string;
  location: string;
  consultation_fee: number;
  rating: number;
  total_reviews: number;
  image_url?: string;
  education: string[];
  languages: string[];
  availability: string;
}

export default function DoctorReviewsPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const doctorId = params?.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    if (!doctorId) return;
    fetchDoctor();
    fetchReviews();
  }, [doctorId]);

  useEffect(() => {
    calculateStats();
  }, [reviews]);

  async function fetchDoctor() {
    setDoctorLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/doctor/${doctorId}/`), {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDoctor(data);
      } else {
        console.error("Failed to fetch doctor details", res.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDoctorLoading(false);
    }
  }

  async function fetchReviews() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/doctor/${doctorId}/reviews/`), {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || data || []);
      } else {
        console.error("Failed to fetch reviews", res.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats() {
    if (reviews.length === 0) {
      setStats({
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
      return;
    }

    const total = reviews.length;
    const average =
      reviews.reduce((sum, review) => sum + review.rating, 0) / total;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    setStats({
      average,
      total,
      distribution,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doctorId) return;
    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

    setSubmitting(true);
    try {
      const res = await fetch(api(`/api/doctor/${doctorId}/reviews/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        setComment("");
        setRating(5);
        await fetchReviews();
        await fetchDoctor(); // Refresh doctor stats
      } else {
        const text = await res.text();
        console.error("Failed to submit review", res.status, text);
        await Swal.fire({
          icon: "error",
          title: "Submission failed",
          text: "Failed to submit review",
        });
      }
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: "Error submitting review",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const RatingBar = ({
    stars,
    count,
    percentage,
  }: {
    stars: number;
    count: number;
    percentage: number;
  }) => (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1 w-16">
        <span className="text-gray-600">{stars}</span>
        <Star className="w-4 h-4 text-amber-400 fill-current" />
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-amber-400 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-gray-600 w-12 text-right">{count}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 mb-4 px-3 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:bg-white/95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
            <span className="text-gray-800 font-medium">
              Back to Doctor Profile
            </span>
          </Button>

          {doctorLoading ? (
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
            </div>
          ) : (
            doctor && (
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {doctor.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {doctor.name}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mt-1">
                      {doctor.specialty}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{doctor.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 min-w-[200px]">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-amber-400 fill-current" />
                        <span className="text-2xl font-bold text-gray-900">
                          {doctor.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {doctor.total_reviews || 0} reviews
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Reviews List - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Rating Summary */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Patient Reviews & Ratings
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Overall Rating */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mb-4">
                      <span className="text-2xl font-bold text-white">
                        {stats.average.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 mr-1 ${
                            star <= Math.round(stats.average)
                              ? "text-amber-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Based on {stats.total} reviews
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <RatingBar
                        key={stars}
                        stars={stars}
                        count={
                          stats.distribution[
                            stars as keyof typeof stats.distribution
                          ]
                        }
                        percentage={
                          stats.total > 0
                            ? (stats.distribution[
                                stars as keyof typeof stats.distribution
                              ] /
                                stats.total) *
                              100
                            : 0
                        }
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <div className="text-gray-600">Loading reviews...</div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Reviews Yet
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Be the first to share your experience with this doctor.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-6 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center font-semibold text-blue-700 text-sm">
                              {review.user_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "A"}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {review.user_name || "Anonymous Patient"}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 mr-1 ${
                                        star <= review.rating
                                          ? "text-amber-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.created_at
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
                          {review.comment}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Review Form Sidebar (wider: 3:2 split) */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Share Your Experience
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Help others make better decisions
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Your Rating
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          aria-label={`${star} star`}
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                            star <= rating
                              ? "bg-amber-400 text-white shadow-md scale-110"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600">
                      {rating === 5
                        ? "Excellent"
                        : rating === 4
                        ? "Very Good"
                        : rating === 3
                        ? "Average"
                        : rating === 2
                        ? "Poor"
                        : "Very Poor"}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 resize-none"
                      placeholder="Share details about your experience with the doctor... Was the appointment timely? How was the bedside manner? Would you recommend them?"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={submitting || comment.trim() === ""}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Post Your Review"
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Your review will help other patients make informed decisions
                    about their healthcare.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
