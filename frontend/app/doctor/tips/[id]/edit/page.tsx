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
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Save,
  FileText,
  Tag,
  Eye,
  EyeOff,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function DoctorTipEditPage({ params }: any) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [characterCount, setCharacterCount] = useState({ title: 0, body: 0 });

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
          setCharacterCount({
            title: data.tip.title?.length || 0,
            body: data.tip.body?.length || 0
          });
        } else {
          setError(data.message || "Failed to load tip");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to fetch health tip");
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      setSaving(false);
      return;
    }
    if (!body.trim()) {
      setError("Content is required");
      setSaving(false);
      return;
    }
    if (title.length > 200) {
      setError("Title should be less than 200 characters");
      setSaving(false);
      return;
    }
    if (body.length > 5000) {
      setError("Content should be less than 5000 characters");
      setSaving(false);
      return;
    }

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
        setSuccess("Health tip updated successfully!");
        setTimeout(() => {
          router.push("/doctor/tips");
        }, 1500);
      } else {
        setError(data.message || "Failed to save health tip");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to save health tip");
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setCharacterCount(prev => ({ ...prev, title: value.length }));
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    setCharacterCount(prev => ({ ...prev, body: value.length }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <FileText className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading health tip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 lg:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/doctor/tips")}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                Edit Health Tip
              </h1>
              <p className="text-gray-600 mt-2">
                Update your health tip to provide valuable information to patients
              </p>
            </div>
          </div>
          
          <Badge 
            variant={isPublished ? "default" : "secondary"}
            className={`px-3 py-1 text-sm ${
              isPublished 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }`}
          >
            {isPublished ? (
              <>
                <Eye className="w-3 h-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 mr-1" />
                Draft
              </>
            )}
          </Badge>
        </div>

        {/* Main Form Card */}
        <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardTitle className="text-xl flex items-center gap-3">
              <FileText className="w-5 h-5" />
              Health Tip Details
            </CardTitle>
            <CardDescription className="text-blue-100">
              Update the title, content, and visibility of your health tip
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSave}>
            <CardContent className="p-6 space-y-6">
              {/* Error and Success Alerts */}
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Title Field */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter a compelling title for your health tip..."
                  className="border-blue-200 focus:border-blue-500 h-12 text-base"
                  required
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Write a clear and engaging title that captures attention
                  </p>
                  <span className={`text-xs ${
                    characterCount.title > 200 ? 'text-red-600' : 
                    characterCount.title > 150 ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {characterCount.title}/200
                  </span>
                </div>
              </div>

              {/* Content Field */}
              <div className="space-y-3">
                <Label htmlFor="body" className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Content *
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => handleBodyChange(e.target.value)}
                  placeholder="Write detailed health information, tips, recommendations, and any important notes for patients..."
                  rows={8}
                  className="border-blue-200 focus:border-blue-500 resize-none text-base leading-relaxed"
                  required
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Provide valuable, accurate health information that helps patients
                  </p>
                  <span className={`text-xs ${
                    characterCount.body > 5000 ? 'text-red-600' : 
                    characterCount.body > 4000 ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {characterCount.body}/5000
                  </span>
                </div>
              </div>

              {/* Tags Field */}
              <div className="space-y-3">
                <Label htmlFor="tags" className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add relevant tags separated by commas (e.g., nutrition, exercise, wellness, prevention)"
                  className="border-blue-200 focus:border-blue-500 h-12"
                />
                <p className="text-xs text-gray-500">
                  Tags help patients discover your content through search and categories
                </p>
                
                {/* Tag Preview */}
                {tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.split(",")
                      .map(tag => tag.trim())
                      .filter(Boolean)
                      .map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-blue-100 text-blue-700 border-blue-200"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))
                    }
                  </div>
                )}
              </div>

              {/* Publication Status */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="published" className="text-sm font-semibold flex items-center gap-2">
                      {isPublished ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-yellow-600" />
                      )}
                      Publication Status
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isPublished 
                        ? "This health tip is visible to patients" 
                        : "This health tip is in draft mode and not visible to patients"
                      }
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>

              {/* Tips for Writing */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Writing Tips for Health Professionals
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Use clear, patient-friendly language</li>
                  <li>• Provide evidence-based information</li>
                  <li>• Include practical tips and recommendations</li>
                  <li>• Mention when to seek professional medical help</li>
                  <li>• Keep paragraphs short and scannable</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="p-6 border-t border-blue-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/doctor/tips")}
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold py-3"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !title.trim() || !body.trim() || title.length > 200 || body.length > 5000}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Health Tip
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Title Length</p>
                <p className="text-lg font-semibold text-gray-900">
                  {characterCount.title}/200
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-green-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Content Length</p>
                <p className="text-lg font-semibold text-gray-900">
                  {characterCount.body}/5000
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tags Added</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tags.split(",").filter(tag => tag.trim()).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}