"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, Phone, Clock, Calendar, User, Loader2, Filter, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Appointment {
  id: number;
  appointment_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  symptoms: string;
  status: string;
  consultation_fee: string;
}

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("confirmed");

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  useEffect(() => {
    if (selectedStatus && allAppointments.length > 0) {
      filterAppointments();
    } else {
      setAppointments(allAppointments);
    }
  }, [selectedStatus, allAppointments]);

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      setStatsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(api('/api/appointment/appointments/'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAllAppointments(data.appointments || []);
          setAppointments(data.appointments || []);
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  const filterAppointments = () => {
    if (!selectedStatus) {
      setAppointments(allAppointments);
    } else {
      const filtered = allAppointments.filter(
        appointment => appointment.status === selectedStatus
      );
      setAppointments(filtered);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      total: allAppointments.length
    };

    allAppointments.forEach(appointment => {
      if (counts.hasOwnProperty(appointment.status)) {
        counts[appointment.status as keyof Omit<typeof counts, 'total'>]++;
      }
    });

    return counts;
  };

  const handleAddPrescription = (appointmentId: number) => {
    router.push(`/doctor/prescription/create?appointment=${appointmentId}`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "completed":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    const baseClasses = "w-5 h-5";
    switch (status) {
      case "confirmed":
        return <Calendar className={`${baseClasses} text-blue-600`} />;
      case "completed":
        return <User className={`${baseClasses} text-green-600`} />;
      case "pending":
        return <Clock className={`${baseClasses} text-yellow-600`} />;
      case "cancelled":
        return <FileText className={`${baseClasses} text-red-600`} />;
      default:
        return <User className={`${baseClasses} text-gray-600`} />;
    }
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <Stethoscope className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Stethoscope className="w-8 h-8 text-white" />
                Patient Appointments
              </h1>
              <p className="text-white mt-2">
                Manage and track all your patient appointments in one place
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700"
              >
                <option value="">All Appointments</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Total Appointments Card */}
          <Card className="bg-white border-l-4 border-l-blue-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                      statusCounts.total
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Cards */}
          {["pending", "confirmed", "completed", "cancelled"].map((status) => (
            <Card 
              key={status} 
              className={`bg-white border-l-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                selectedStatus === status ? 'ring-2 ring-blue-300' : ''
              } ${
                status === 'pending' ? 'border-l-yellow-500' :
                status === 'confirmed' ? 'border-l-blue-500' :
                status === 'completed' ? 'border-l-green-500' :
                'border-l-red-500'
              }`}
              onClick={() => setSelectedStatus(selectedStatus === status ? '' : status)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {statsLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        statusCounts[status as keyof Omit<typeof statusCounts, 'total'>]
                      )}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                    status === 'completed' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Appointments Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {selectedStatus
                    ? `You don't have any ${selectedStatus} appointments at the moment.`
                    : "You don't have any appointments scheduled yet."}
                </p>
                {selectedStatus && (
                  <Button 
                    onClick={() => setSelectedStatus('')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    View All Appointments
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results Count */}
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-blue-100">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{appointments.length}</span> 
                  {selectedStatus ? ` ${selectedStatus}` : ''} appointment(s)
                  {selectedStatus && (
                    <span>
                      {' '}out of <span className="font-semibold text-gray-900">{statusCounts.total}</span> total
                    </span>
                  )}
                </p>
              </div>

              {/* Appointments */}
              {appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Patient Info Section */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-14 h-14 border-2 border-blue-100 shadow-sm">
                            <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                              {appointment.patient_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {appointment.patient_name}
                              </h3>
                              <Badge
                                variant={getStatusVariant(appointment.status)}
                                className={`capitalize px-3 py-1 rounded-full ${getStatusColor(appointment.status)} border`}
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User className="w-4 h-4 text-blue-600" />
                                  <span>Age: {appointment.patient_age} • {appointment.patient_gender}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4 text-blue-600" />
                                  <span>{appointment.patient_phone}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">ID:</span> {appointment.appointment_id}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <span>
                                    {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">{appointment.appointment_time}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Fee:</span> Rs {appointment.consultation_fee}
                                </div>
                              </div>
                            </div>
                            
                            {/* Medical Information */}
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Reason for Visit</h4>
                                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                                </div>
                                {appointment.symptoms && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Symptoms</h4>
                                    <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Section */}
                      <div className="lg:w-48 flex flex-col justify-between gap-4">
                        <div className="text-center lg:text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            {appointment.appointment_time}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          className={`w-full font-medium rounded-lg transition-all duration-200 ${
                            appointment.status === "completed" || appointment.status === "cancelled"
                              ? "bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                          }`}
                          onClick={() => handleAddPrescription(appointment.id)}
                          disabled={
                            appointment.status === "completed" ||
                            appointment.status === "cancelled"
                          }
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {appointment.status === "completed"
                            ? "Prescription Added"
                            : "Add Prescription"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}