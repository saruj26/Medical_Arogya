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
  Lightbulb,
  Stethoscope,
  Loader2,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users
} from "lucide-react";

export default function DoctorTipCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [characterCount, setCharacterCount] = useState({ title: 0, body: 0 });

  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    if (role !== "doctor") {
      if (typeof window !== "undefined") window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!body.trim()) {
      setError("Content is required");
      return;
    }
    if (title.length > 200) {
      setError("Title should be less than 200 characters");
      return;
    }
    if (body.length > 5000) {
      setError("Content should be less than 5000 characters");
      return;
    }

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

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const errJson = await res.json();
          setError(errJson.message || errJson.error || JSON.stringify(errJson));
        } else {
          const text = await res.text();
          setError(text ? text.slice(0, 1000) : "Server error");
        }
        return;
      }

      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        setError(text || "Unexpected server response");
        return;
      }

      if (data.success) {
        setSuccess("Health tip created successfully!");
        setTimeout(() => {
          router.push("/doctor/tips");
        }, 1500);
      } else {
        setError(data.message || "Failed to create health tip");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to create health tip");
    } finally {
      setLoading(false);
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

  const suggestedTags = [
    "nutrition", "exercise", "wellness", "prevention", 
    "mental health", "hygiene", "symptoms", "treatment",
    "diet", "fitness", "lifestyle", "children health"
  ];

  const addSuggestedTag = (tag: string) => {
    const currentTags = tags.split(",").map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      currentTags.push(tag);
      setTags(currentTags.join(", "));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
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
                  Create Health Tip
                </h1>
                <p className="text-gray-600 mt-2">
                  Share valuable health information and tips with your patients
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
                  Will Publish
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Save as Draft
                </>
              )}
            </Badge>
          </div>

          {/* Main Form Card */}
          <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <CardTitle className="text-xl flex items-center gap-3">
                <Lightbulb className="w-5 h-5" />
                Health Tip Information
              </CardTitle>
              <CardDescription className="text-blue-100">
                Create engaging and informative health content for your patients
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
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
                    placeholder="Enter a compelling title that captures attention..."
                    className="border-blue-200 focus:border-blue-500 h-12 text-base"
                    required
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Keep it concise and engaging (2-8 words recommended)
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
                    placeholder="Write detailed health information, practical tips, evidence-based recommendations, and any important notes for patients. Use clear, patient-friendly language..."
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
                    placeholder="Add relevant tags separated by commas to help patients discover your content..."
                    className="border-blue-200 focus:border-blue-500 h-12"
                  />
                  <p className="text-xs text-gray-500">
                    Tags improve discoverability through search and categories
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
                          ? "Publish immediately for patients to see" 
                          : "Save as draft for later editing and publishing"
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
              </CardContent>

              <CardFooter className="p-6 border-t border-blue-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/doctor/tips")}
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold py-3"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !title.trim() || !body.trim() || title.length > 200 || body.length > 5000}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Tip...
                      </>
                    ) : isPublished ? (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Publish Health Tip
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save as Draft
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Writing Guidelines */}
          <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Writing Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Best Practices
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Use clear, patient-friendly language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Provide evidence-based information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Include practical, actionable tips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Mention when to seek professional help</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Keep paragraphs short and scannable</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Important Notes
                </h4>
                <p className="text-xs text-amber-700">
                  Always maintain patient confidentiality and avoid giving specific medical advice without proper consultation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Tags */}
          <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Suggested Tags
              </CardTitle>
              <CardDescription>
                Click to add popular tags to your health tip
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer bg-white border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                    onClick={() => addSuggestedTag(tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Content Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Title Length</span>
                <span className={`font-semibold ${
                  characterCount.title > 200 ? 'text-red-600' : 
                  characterCount.title > 150 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {characterCount.title}/200
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Content Length</span>
                <span className={`font-semibold ${
                  characterCount.body > 5000 ? 'text-red-600' : 
                  characterCount.body > 4000 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {characterCount.body}/5000
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tags Added</span>
                <span className="font-semibold text-green-600">
                  {tags.split(",").filter(tag => tag.trim()).length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card className="bg-white rounded-2xl shadow-sm border border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Why Share Health Tips?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Educate and empower your patients</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Build trust and establish expertise</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Reach more patients with valuable information</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Promote preventive healthcare practices</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}