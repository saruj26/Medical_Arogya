"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "lucide-react"

interface ChangePasswordProps {
  userRole?: string
  onSuccess?: () => void
}

export function ChangePassword({ userRole = "customer", onSuccess }: ChangePasswordProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match")
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Demo validation - current password should be "password123"
    if (formData.currentPassword !== "password123") {
      setError("Current password is incorrect")
      setIsLoading(false)
      return
    }

    setSuccess("Password changed successfully!")
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsLoading(false)

    if (onSuccess) {
      setTimeout(onSuccess, 2000)
    }
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <Card className="border-2 border-[#1656a4]/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Change Password
        </CardTitle>
        <CardDescription className="text-blue-100">Update your password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="h-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-10 px-3"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="h-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-10 px-3"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-10 px-3"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 text-sm">Password Requirements:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Mix of letters and numbers recommended</li>
              <li>• Avoid using personal information</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Demo:</strong> Current password is "password123"
            </p>
          </div>

          <Button type="submit" className="w-full bg-[#1656a4] hover:bg-[#1656a4]/90 h-10" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Changing Password...
              </div>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
