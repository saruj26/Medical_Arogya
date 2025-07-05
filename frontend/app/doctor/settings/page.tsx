"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePassword } from "@/components/change-password"
import { Stethoscope, ArrowLeft, User, Bell, Shield, Clock } from "lucide-react"

export default function DoctorSettings() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (role !== "doctor") {
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
          <Link href="/doctor">
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
            <span className="text-lg sm:text-xl font-bold text-[#1656a4]">Doctor Settings</span>
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
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription className="text-sm">Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">{userEmail}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Account Type</label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">Doctor</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Specialty</label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">Cardiology</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">License Status</label>
                  <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                    Active
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Clock className="w-5 h-5" />
                Schedule Preferences
              </CardTitle>
              <CardDescription className="text-sm">Manage your availability and working hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Working Days</label>
                  <div className="mt-2 space-y-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" defaultChecked={day !== "Saturday"} />
                        <span className="text-sm">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Working Hours</label>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Start Time</label>
                      <input
                        type="time"
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                        defaultValue="09:00"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">End Time</label>
                      <input
                        type="time"
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                        defaultValue="17:00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Save Schedule</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-sm">Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">New Appointment Notifications</p>
                    <p className="text-xs text-gray-600">Get notified when patients book appointments</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Appointment Reminders</p>
                    <p className="text-xs text-gray-600">Receive reminders 30 minutes before appointments</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Patient Messages</p>
                    <p className="text-xs text-gray-600">Get notified of patient inquiries</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">System Updates</p>
                    <p className="text-xs text-gray-600">Receive platform updates and announcements</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Save Preferences</Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <ChangePassword userRole="doctor" />

          {/* Privacy Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-sm">Manage your privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Profile Visibility</p>
                    <p className="text-xs text-gray-600">Allow patients to see your profile in search results</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Online Status</p>
                    <p className="text-xs text-gray-600">Show when you're available for consultations</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Data Analytics</p>
                    <p className="text-xs text-gray-600">Allow anonymized data usage for platform improvement</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Save Settings</Button>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Stethoscope className="w-5 h-5" />
                Professional Information
              </CardTitle>
              <CardDescription className="text-sm">Update your professional credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Medical License Number</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    placeholder="MED123456"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    placeholder="15 years"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hospital Affiliation</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    placeholder="City Heart Hospital"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Consultation Fee</label>
                  <input type="number" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" placeholder="500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Professional Bio</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                  rows={4}
                  placeholder="Brief description of your expertise and experience"
                />
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Update Information</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
