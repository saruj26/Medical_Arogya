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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Stethoscope, 
  Heart,
  Share2,
  Bookmark
} from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
              <Skeleton className="h-8 w-3/4 bg-blue-400" />
              <Skeleton className="h-4 w-1/2 bg-blue-400" />
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                  <Skeleton className="h-3 w-24 bg-gray-200" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-2/3 bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full shadow-xl border-0 text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Tip</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  if (!tip)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full shadow-xl border-0 text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tip Not Found</h3>
            <p className="text-gray-600 mb-6">The requested health tip could not be found.</p>
            <Button 
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tips
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-blue-200">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="border-blue-200">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Header with Gradient */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white pb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-4 leading-tight">
                  {tip.title}
                </CardTitle>
                
                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-white/20">
                    <AvatarFallback className="bg-white/20 text-white font-semibold">
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white/90">
                      Dr. {tip.doctor_name || "Medical Expert"}
                    </p>
                    <CardDescription className="text-white/70 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {tip.created_at
                        ? new Date(tip.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "Recent"}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-8">
            {/* Tags */}
            {tip.tags && tip.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tip.tags.map((t: string) => (
                  <Badge 
                    key={t} 
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            )}

            {/* Tip Body */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-500 pl-6 py-4 mb-6">
                <p className="text-blue-800 text-lg leading-relaxed font-medium">
                  {tip.body}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <div className="flex items-center gap-3 mb-3">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Professional Health Tip</h4>
              </div>
              <p className="text-sm text-gray-600">
                This health advice is provided by qualified medical professionals. 
                Always consult with your healthcare provider for personalized medical guidance.
              </p>
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="bg-gray-50 px-8 py-6 border-t">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Helpful for 85% of readers</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>5 min read</span>
              </div>
              
              <Button 
                onClick={() => router.back()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Tips
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Related Tips Suggestion */}
        <Card className="mt-8 shadow-lg border-0">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl text-gray-900">
              More Health Tips
            </CardTitle>
            <CardDescription>
              Discover more helpful health advice from our medical experts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              Explore our complete collection of health tips and wellness advice.
            </p>
            <Button 
              onClick={() => router.push('/customer/tips')}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Browse All Tips
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}