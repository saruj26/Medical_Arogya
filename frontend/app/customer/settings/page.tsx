"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePassword } from "@/components/change-password"
import { Stethoscope, ArrowLeft, User, Bell, Shield } from "lucide-react"

export default function CustomerSettings() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (role !== "customer") {
      router.push("/")
      return
    }

    setUserEmail(email || "")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/customer">
            <Button
              variant="outline"
              size="sm"
              className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent p-2 sm:px-4"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#1656a4]">Settings</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your account preferences and security</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Account Information */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">{userEmail}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Account Type</label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">Patient</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-gray-600">Receive appointment reminders via email</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">SMS Notifications</p>
                    <p className="text-xs text-gray-600">Receive appointment reminders via SMS</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Marketing Communications</p>
                    <p className="text-xs text-gray-600">Receive health tips and promotional offers</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Save Preferences</Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <ChangePassword userRole="customer" />

          {/* Privacy Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Profile Visibility</p>
                    <p className="text-xs text-gray-600">Allow doctors to see your medical history</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Data Sharing</p>
                    <p className="text-xs text-gray-600">Share anonymized data for research purposes</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Save Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
