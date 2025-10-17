// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Calendar,
//   Clock,
//   User,
//   Stethoscope,
//   FileText,
//   LogOut,
//   Phone,
//   Settings,
// } from "lucide-react";

// // Mock data
// const mockAppointments = [
//   {
//     id: 1,
//     patient: "John Doe",
//     age: 35,
//     gender: "Male",
//     phone: "+91 98765 43210",
//     date: "2024-12-25",
//     time: "2:00 PM",
//     reason: "Regular checkup",
//     symptoms: "Chest pain, shortness of breath",
//     status: "confirmed",
//   },
//   {
//     id: 2,
//     patient: "Jane Smith",
//     age: 28,
//     gender: "Female",
//     phone: "+91 98765 43211",
//     date: "2024-12-25",
//     time: "3:00 PM",
//     reason: "Follow-up consultation",
//     symptoms: "Persistent cough",
//     status: "confirmed",
//   },
//   {
//     id: 3,
//     patient: "Mike Johnson",
//     age: 42,
//     gender: "Male",
//     phone: "+91 98765 43212",
//     date: "2024-12-24",
//     time: "10:00 AM",
//     reason: "Heart consultation",
//     symptoms: "Irregular heartbeat",
//     status: "completed",
//   },
// ];

// const mockPrescriptions = [
//   {
//     id: 1,
//     patient: "Mike Johnson",
//     date: "2024-12-24",
//     medications: ["Aspirin 75mg", "Metoprolol 50mg"],
//     instructions:
//       "Take aspirin once daily after breakfast. Metoprolol twice daily.",
//     diagnosis: "Mild hypertension",
//   },
// ];

// export default function DoctorDashboard() {
//   const router = useRouter();
//   const [userEmail, setUserEmail] = useState("");
//   const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
//   const [prescriptionForm, setPrescriptionForm] = useState({
//     diagnosis: "",
//     medications: "",
//     instructions: "",
//     followUp: "",
//   });

//   useEffect(() => {
//     const role = localStorage.getItem("userRole");
//     const email = localStorage.getItem("userEmail");

//     if (role !== "doctor") {
//       router.push("/auth");
//       return;
//     }

//     setUserEmail(email || "");
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userEmail");
//     router.push("/");
//   };

//   const handlePrescriptionSubmit = (appointmentId: number) => {
//     // Simulate prescription creation
//     console.log(
//       "Prescription created for appointment:",
//       appointmentId,
//       prescriptionForm
//     );
//     setPrescriptionForm({
//       diagnosis: "",
//       medications: "",
//       instructions: "",
//       followUp: "",
//     });
//     setSelectedAppointment(null);
//   };

//   const todayAppointments = mockAppointments.filter(
//     (apt) => apt.date === "2024-12-25"
//   );
//   const completedAppointments = mockAppointments.filter(
//     (apt) => apt.status === "completed"
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b sticky top-0 z-40">
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
//               <Stethoscope className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-lg sm:text-xl font-bold text-[#1656a4]">
//               Arogya
//             </span>
//           </Link>

//           <div className="flex items-center gap-2 sm:gap-4">
//             <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
//               Dr. {userEmail}
//             </span>
//             <Link href="/doctor/settings">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="p-2 sm:px-3 bg-transparent"
//               >
//                 <Settings className="w-4 h-4 sm:mr-2" />
//                 <span className="hidden sm:inline">Settings</span>
//               </Button>
//             </Link>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleLogout}
//               className="p-2 sm:px-3 bg-transparent"
//             >
//               <LogOut className="w-4 h-4 sm:mr-2" />
//               <span className="hidden sm:inline">Logout</span>
//             </Button>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-4 sm:py-8">
//         <div className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//             Doctor Dashboard
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600">
//             Manage your appointments and patient care
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
//           <Card>
//             <CardContent className="p-3 sm:p-6">
//               <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
//                 <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
//                 </div>
//                 <div className="text-center sm:text-left">
//                   <p className="text-lg sm:text-2xl font-bold">
//                     {todayAppointments.length}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     Today's Appointments
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3 sm:p-6">
//               <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
//                 <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <User className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
//                 </div>
//                 <div className="text-center sm:text-left">
//                   <p className="text-lg sm:text-2xl font-bold">
//                     {completedAppointments.length}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     Completed Today
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3 sm:p-6">
//               <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
//                 <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
//                 </div>
//                 <div className="text-center sm:text-left">
//                   <p className="text-lg sm:text-2xl font-bold">
//                     {mockPrescriptions.length}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     Prescriptions
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3 sm:p-6">
//               <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
//                 <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
//                 </div>
//                 <div className="text-center sm:text-left">
//                   <p className="text-lg sm:text-2xl font-bold">2:00 PM</p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     Next Appointment
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="appointments" className="space-y-4 sm:space-y-6">
//           <TabsList className="grid w-full grid-cols-3 h-10 sm:h-12">
//             <TabsTrigger value="appointments" className="text-xs sm:text-sm">
//               Today's Appointments
//             </TabsTrigger>
//             <TabsTrigger value="prescriptions" className="text-xs sm:text-sm">
//               Prescriptions
//             </TabsTrigger>
//             <TabsTrigger value="profile" className="text-xs sm:text-sm">
//               Profile
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="appointments" className="space-y-4 sm:space-y-6">
//             <div className="grid gap-4">
//               {todayAppointments.map((appointment) => (
//                 <Card
//                   key={appointment.id}
//                   className="hover:shadow-lg transition-shadow"
//                 >
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                       <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
//                         <Avatar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto sm:mx-0">
//                           <AvatarFallback>
//                             {appointment.patient
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1 text-center sm:text-left">
//                           <h3 className="font-semibold text-base sm:text-lg">
//                             {appointment.patient}
//                           </h3>
//                           <div className="text-xs sm:text-sm text-gray-600 space-y-1">
//                             <p>
//                               Age: {appointment.age} • Gender:{" "}
//                               {appointment.gender}
//                             </p>
//                             <p className="flex items-center justify-center sm:justify-start gap-1">
//                               <Phone className="w-3 h-3" />
//                               {appointment.phone}
//                             </p>
//                             <p>
//                               <strong>Reason:</strong> {appointment.reason}
//                             </p>
//                             <p>
//                               <strong>Symptoms:</strong> {appointment.symptoms}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="text-center lg:text-right">
//                         <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
//                           <Clock className="w-4 h-4 text-gray-500" />
//                           <span className="font-medium">
//                             {appointment.time}
//                           </span>
//                         </div>
//                         <Badge
//                           variant={
//                             appointment.status === "confirmed"
//                               ? "default"
//                               : "secondary"
//                           }
//                           className="mb-3"
//                         >
//                           {appointment.status}
//                         </Badge>
//                         <div className="space-y-2">
//                           <Button
//                             size="sm"
//                             className="w-full bg-[#1656a4] hover:bg-[#1656a4]/90"
//                             onClick={() => setSelectedAppointment(appointment)}
//                           >
//                             <FileText className="w-4 h-4 mr-2" />
//                             Add Prescription
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Prescription Modal */}
//             {selectedAppointment && (
//               <Card className="mt-6">
//                 <CardHeader>
//                   <CardTitle className="text-lg sm:text-xl">
//                     Add Prescription for {selectedAppointment.patient}
//                   </CardTitle>
//                   <CardDescription className="text-sm">
//                     Appointment: {selectedAppointment.date} at{" "}
//                     {selectedAppointment.time}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label htmlFor="diagnosis" className="text-sm font-medium">
//                       Diagnosis
//                     </Label>
//                     <Input
//                       id="diagnosis"
//                       value={prescriptionForm.diagnosis}
//                       onChange={(e) =>
//                         setPrescriptionForm({
//                           ...prescriptionForm,
//                           diagnosis: e.target.value,
//                         })
//                       }
//                       placeholder="Enter diagnosis"
//                       className="mt-1"
//                     />
//                   </div>

//                   <div>
//                     <Label
//                       htmlFor="medications"
//                       className="text-sm font-medium"
//                     >
//                       Medications
//                     </Label>
//                     <Textarea
//                       id="medications"
//                       value={prescriptionForm.medications}
//                       onChange={(e) =>
//                         setPrescriptionForm({
//                           ...prescriptionForm,
//                           medications: e.target.value,
//                         })
//                       }
//                       placeholder="List medications with dosage (one per line)"
//                       rows={3}
//                       className="mt-1"
//                     />
//                   </div>

//                   <div>
//                     <Label
//                       htmlFor="instructions"
//                       className="text-sm font-medium"
//                     >
//                       Instructions
//                     </Label>
//                     <Textarea
//                       id="instructions"
//                       value={prescriptionForm.instructions}
//                       onChange={(e) =>
//                         setPrescriptionForm({
//                           ...prescriptionForm,
//                           instructions: e.target.value,
//                         })
//                       }
//                       placeholder="Detailed instructions for the patient"
//                       rows={3}
//                       className="mt-1"
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="followUp" className="text-sm font-medium">
//                       Follow-up
//                     </Label>
//                     <Input
//                       id="followUp"
//                       value={prescriptionForm.followUp}
//                       onChange={(e) =>
//                         setPrescriptionForm({
//                           ...prescriptionForm,
//                           followUp: e.target.value,
//                         })
//                       }
//                       placeholder="Follow-up instructions (e.g., 'Return in 2 weeks')"
//                       className="mt-1"
//                     />
//                   </div>

//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <Button
//                       variant="outline"
//                       onClick={() => setSelectedAppointment(null)}
//                       className="flex-1"
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       className="bg-[#1656a4] hover:bg-[#1656a4]/90 flex-1"
//                       onClick={() =>
//                         handlePrescriptionSubmit(selectedAppointment.id)
//                       }
//                     >
//                       Save Prescription
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           <TabsContent value="prescriptions" className="space-y-4 sm:space-y-6">
//             <div className="grid gap-4">
//               {mockPrescriptions.map((prescription) => (
//                 <Card key={prescription.id}>
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-base sm:text-lg mb-2">
//                           {prescription.patient}
//                         </h3>
//                         <p className="text-xs sm:text-sm text-gray-600 mb-3">
//                           {prescription.date}
//                         </p>

//                         <div className="space-y-3">
//                           <div>
//                             <h4 className="font-medium text-sm">Diagnosis:</h4>
//                             <p className="text-xs sm:text-sm text-gray-600">
//                               {prescription.diagnosis}
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className="font-medium text-sm">
//                               Medications:
//                             </h4>
//                             <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600">
//                               {prescription.medications.map((med, index) => (
//                                 <li key={index}>{med}</li>
//                               ))}
//                             </ul>
//                           </div>

//                           <div>
//                             <h4 className="font-medium text-sm">
//                               Instructions:
//                             </h4>
//                             <p className="text-xs sm:text-sm text-gray-600">
//                               {prescription.instructions}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="bg-transparent"
//                       >
//                         <FileText className="w-4 h-4 mr-2" />
//                         View Full
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="profile" className="space-y-4 sm:space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg sm:text-xl">
//                   Doctor Profile
//                 </CardTitle>
//                 <CardDescription className="text-sm">
//                   Manage your professional information
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="doctorName" className="text-sm font-medium">
//                       Full Name
//                     </Label>
//                     <Input
//                       id="doctorName"
//                       placeholder="Dr. Sarah Johnson"
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="specialty" className="text-sm font-medium">
//                       Specialty
//                     </Label>
//                     <Input
//                       id="specialty"
//                       placeholder="Cardiology"
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="experience" className="text-sm font-medium">
//                       Experience
//                     </Label>
//                     <Input
//                       id="experience"
//                       placeholder="15 years"
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label
//                       htmlFor="qualification"
//                       className="text-sm font-medium"
//                     >
//                       Qualification
//                     </Label>
//                     <Input
//                       id="qualification"
//                       placeholder="MBBS, MD Cardiology"
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="license" className="text-sm font-medium">
//                       License Number
//                     </Label>
//                     <Input
//                       id="license"
//                       placeholder="MED123456"
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="phone" className="text-sm font-medium">
//                       Phone
//                     </Label>
//                     <Input
//                       id="phone"
//                       placeholder="+91 98765 43210"
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="bio" className="text-sm font-medium">
//                     Professional Bio
//                   </Label>
//                   <Textarea
//                     id="bio"
//                     placeholder="Brief description of your expertise and experience"
//                     rows={4}
//                     className="mt-1"
//                   />
//                 </div>

//                 <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">
//                   Update Profile
//                 </Button>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  LogOut,
  Phone,
  Settings,
  Menu,
  X,
  Home,
  CalendarDays,
} from "lucide-react";

// Mock data
const mockAppointments = [
  {
    id: 1,
    patient: "John Doe",
    age: 35,
    gender: "Male",
    phone: "+91 98765 43210",
    date: "2024-12-25",
    time: "2:00 PM",
    reason: "Regular checkup",
    symptoms: "Chest pain, shortness of breath",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Jane Smith",
    age: 28,
    gender: "Female",
    phone: "+91 98765 43211",
    date: "2024-12-25",
    time: "3:00 PM",
    reason: "Follow-up consultation",
    symptoms: "Persistent cough",
    status: "confirmed",
  },
];

export default function DoctorDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    medications: "",
    instructions: "",
    followUp: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "doctor") {
      router.push("/auth");
      return;
    }

    setUserEmail(email || "");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/");
  };

  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date === "2024-12-25"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{todayAppointments.length}</p>
                      <p className="text-sm text-gray-600">Today's Appointments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-sm text-gray-600">Completed Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-gray-600">Prescriptions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2:00 PM</p>
                      <p className="text-sm text-gray-600">Next Appointment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {appointment.patient.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{appointment.patient}</p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.time}</p>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "appointments":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Today's Appointments</h2>
            <div className="grid gap-4">
              {todayAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto sm:mx-0">
                          <AvatarFallback>
                            {appointment.patient.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-semibold text-base sm:text-lg">{appointment.patient}</h3>
                          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                            <p>Age: {appointment.age} • Gender: {appointment.gender}</p>
                            <p className="flex items-center justify-center sm:justify-start gap-1">
                              <Phone className="w-3 h-3" />
                              {appointment.phone}
                            </p>
                            <p><strong>Reason:</strong> {appointment.reason}</p>
                            <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center lg:text-right">
                        <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"} className="mb-3">
                          {appointment.status}
                        </Badge>
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            className="w-full bg-[#1656a4] hover:bg-[#1656a4]/90"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Add Prescription
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Doctor Profile</CardTitle>
                <CardDescription className="text-sm">
                  Manage your professional information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctorName" className="text-sm font-medium">Full Name</Label>
                    <Input id="doctorName" placeholder="Dr. Sarah Johnson" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="specialty" className="text-sm font-medium">Specialty</Label>
                    <Input id="specialty" placeholder="Cardiology" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="experience" className="text-sm font-medium">Experience</Label>
                    <Input id="experience" placeholder="15 years" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="qualification" className="text-sm font-medium">Qualification</Label>
                    <Input id="qualification" placeholder="MBBS, MD Cardiology" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="license" className="text-sm font-medium">License Number</Label>
                    <Input id="license" placeholder="MED123456" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                    <Input id="phone" placeholder="+91 98765 43210" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-sm font-medium">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Brief description of your expertise and experience"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">Update Profile</Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1656a4]">Arogya</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "appointments" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("appointments")}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Appointments
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <div className="space-y-2">
              <Link href="/doctor/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">Dr. {userEmail}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}