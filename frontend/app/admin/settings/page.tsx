"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePassword } from "@/components/change-password"
import { Stethoscope, ArrowLeft, User, Bell, Shield, SettingsIcon } from "lucide-react"

export default function AdminSettings() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (role !== "admin") {
      router.push("/auth")
      return
    }

    setUserEmail(email || "")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/admin">
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
            <span className="text-lg sm:text-xl font-bold text-[#1656a4]">Admin Settings</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage system settings and your account</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Account Information */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription className="text-sm">Your admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">{userEmail}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Account Type</label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">Administrator</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Access Level</label>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                    Full Access
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Login</label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">Today, 10:30 AM</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <SettingsIcon className="w-5 h-5" />
                System Configuration
              </CardTitle>
              <CardDescription className="text-sm">Manage platform-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">New User Registration</p>
                    <p className="text-xs text-gray-600">Allow new patients to register</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Doctor Auto-Approval</p>
                    <p className="text-xs text-gray-600">Automatically approve new doctor registrations</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Maintenance Mode</p>
                    <p className="text-xs text-gray-600">Put the platform in maintenance mode</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Default Consultation Fee</label>
                  <input
                    type="number"
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    placeholder="500"
                    defaultValue="500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Platform Commission (%)</label>
                  <input
                    type="number"
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    placeholder="10"
                    defaultValue="10"
                  />
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Save System Settings</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Bell className="w-5 h-5" />
                Admin Notifications
              </CardTitle>
              <CardDescription className="text-sm">Configure admin notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">New Doctor Applications</p>
                    <p className="text-xs text-gray-600">Get notified when doctors apply to join</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Payment Issues</p>
                    <p className="text-xs text-gray-600">Get notified of payment failures or disputes</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">System Alerts</p>
                    <p className="text-xs text-gray-600">Receive critical system alerts and errors</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Daily Reports</p>
                    <p className="text-xs text-gray-600">Receive daily platform activity reports</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Save Preferences</Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <ChangePassword userRole="admin" />

          {/* Security Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-5 h-5" />
                Security & Access Control
              </CardTitle>
              <CardDescription className="text-sm">Manage security settings and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-600">Enable 2FA for enhanced security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Session Timeout</p>
                    <p className="text-xs text-gray-600">Automatically log out after inactivity</p>
                  </div>
                  <select className="px-3 py-1 border rounded text-sm">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>Never</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Login Alerts</p>
                    <p className="text-xs text-gray-600">Get notified of admin login attempts</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Save Security Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
