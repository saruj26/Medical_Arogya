"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePassword } from "@/components/change-password"
import { 
  Stethoscope, 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  SettingsIcon, 
  Save,
  CheckCircle2,
  Zap,
  Sparkles
} from "lucide-react"

export default function AdminSettings() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [systemSettings, setSystemSettings] = useState({
    userRegistration: true,
    doctorAutoApproval: false,
    maintenanceMode: false,
    consultationFee: 500,
    platformCommission: 10
  })
  const [notificationSettings, setNotificationSettings] = useState({
    newDoctors: true,
    paymentIssues: true,
    systemAlerts: true,
    dailyReports: false
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: "30 minutes",
    loginAlerts: true
  })

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (role !== "admin") {
      router.push("/auth")
      return
    }

    setUserEmail(email || "")
  }, [router])

  const handleSaveSystemSettings = () => {
    console.log("Saving system settings:", systemSettings)
  }

  const handleSaveNotificationSettings = () => {
    console.log("Saving notification settings:", notificationSettings)
  }

  const handleSaveSecuritySettings = () => {
    console.log("Saving security settings:", securitySettings)
  }

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg 
          ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
                  Admin Settings
                </span>
                <span className="text-xs text-gray-500 -mt-1">System Configuration Center</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Administrator</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-2xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-1">Manage platform configuration and security settings</p>
            </div>
          </div>
        </div>

        {/* 2 Cards per Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
          {/* Account Information */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50/50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                Account Information
              </CardTitle>
              <CardDescription>Your administrator account details and access information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{userEmail}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-green-50/30 rounded-2xl p-4 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Account Type</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-900 font-medium">System Administrator</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-red-50/30 rounded-2xl p-4 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Access Level</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-red-700 font-medium">Full System Access</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-2xl p-4 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Last Login</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-900 font-medium">Today, 10:30 AM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50/50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                System Configuration
              </CardTitle>
              <CardDescription>Manage platform-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">New User Registration</p>
                      <p className="text-sm text-gray-600">Allow new patients to register</p>
                    </div>
                    <ToggleSwitch
                      checked={systemSettings.userRegistration}
                      onChange={(checked) => setSystemSettings({...systemSettings, userRegistration: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">Doctor Auto-Approval</p>
                      <p className="text-sm text-gray-600">Automatically approve new doctors</p>
                    </div>
                    <ToggleSwitch
                      checked={systemSettings.doctorAutoApproval}
                      onChange={(checked) => setSystemSettings({...systemSettings, doctorAutoApproval: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-600">Put platform in maintenance mode</p>
                    </div>
                    <ToggleSwitch
                      checked={systemSettings.maintenanceMode}
                      onChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Consultation Fee</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs</span>
                      <input
                        type="number"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl transition-all"
                        value={systemSettings.consultationFee}
                        onChange={(e) => setSystemSettings({...systemSettings, consultationFee: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Commission</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl transition-all"
                        value={systemSettings.platformCommission}
                        onChange={(e) => setSystemSettings({...systemSettings, platformCommission: Number(e.target.value)})}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveSystemSettings}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/90 hover:to-emerald-600/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save System Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50/50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                Admin Notifications
              </CardTitle>
              <CardDescription>Configure admin notification preferences and alerts</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { key: 'newDoctors' as const, title: 'New Doctor Applications', description: 'Get notified when doctors apply to join' },
                  { key: 'paymentIssues' as const, title: 'Payment Issues', description: 'Get notified of payment failures or disputes' },
                  { key: 'systemAlerts' as const, title: 'System Alerts', description: 'Receive critical system alerts and errors' },
                  { key: 'dailyReports' as const, title: 'Daily Reports', description: 'Receive daily platform activity reports' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-purple-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ToggleSwitch
                      checked={notificationSettings[item.key]}
                      onChange={(checked) => setNotificationSettings({...notificationSettings, [item.key]: checked})}
                    />
                  </div>
                ))}
                
                <Button 
                  onClick={handleSaveNotificationSettings}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-500/90 hover:to-pink-600/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50/50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Security & Access Control
              </CardTitle>
              <CardDescription>Manage security settings and access controls</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Enable 2FA for enhanced security</p>
                    </div>
                    <Button 
                      variant={securitySettings.twoFactor ? "default" : "outline"}
                      className={securitySettings.twoFactor 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "border-red-300 text-red-700 hover:bg-red-50"
                      }
                    >
                      {securitySettings.twoFactor ? 'Enabled' : 'Enable 2FA'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">Session Timeout</p>
                      <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                    </div>
                    <select 
                      className="px-4 py-2 border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl transition-all"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                    >
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">Login Alerts</p>
                      <p className="text-sm text-gray-600">Get notified of admin login attempts</p>
                    </div>
                    <ToggleSwitch
                      checked={securitySettings.loginAlerts}
                      onChange={(checked) => setSecuritySettings({...securitySettings, loginAlerts: checked})}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveSecuritySettings}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-500/90 hover:to-orange-600/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password - Full Width */}
          <div className="lg:col-span-2">
            <ChangePassword userRole="admin" />
          </div>
        </div>
      </div>
    </div>
  )
}