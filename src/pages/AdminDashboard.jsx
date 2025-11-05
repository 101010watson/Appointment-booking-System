import React, { useEffect, useState } from 'react';
import { admin, appointments as appointmentsApi } from '../lib/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Users, Calendar, Activity } from 'lucide-react';

export const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([loadAppointments(), loadUsers()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await admin.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await admin.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await appointmentsApi.delete(appointmentId);
      loadAppointments();
    } catch (error) {
      alert('Error deleting appointment: ' + error.message);
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      await appointmentsApi.update(appointmentId, status, null);
      loadAppointments();
    } catch (error) {
      alert('Error updating appointment: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      patient: 'bg-green-100 text-green-800',
      doctor: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    totalUsers: users.length,
    totalPatients: users.filter((u) => u.role === 'patient').length,
    totalDoctors: users.filter((u) => u.role === 'doctor').length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
    confirmedAppointments: appointments.filter((a) => a.status === 'confirmed').length,
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center space-x-4">
            <Users className="text-blue-600" size={32} />
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <Calendar className="text-green-600" size={32} />
            <div>
              <p className="text-gray-600 text-sm">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <Activity className="text-orange-600" size={32} />
            <div>
              <p className="text-gray-600 text-sm">Pending Appointments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingAppointments}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6 flex space-x-3">
        <Button
          variant={activeTab === 'overview' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'users' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </Button>
        <Button
          variant={activeTab === 'appointments' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </Button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Patients</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Doctors</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalDoctors}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Pending Appt</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Confirmed Appt</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmedAppointments}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid gap-6">
          {users.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500">No users found</p>
            </Card>
          ) : (
            users.map((user) => (
              <Card key={user.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{user.full_name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="grid gap-6">
          {appointments.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500">No appointments found</p>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment.id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {appointment.patient?.full_name} → Dr. {appointment.doctor?.full_name}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>{appointment.appointment_date} at {appointment.appointment_time}</p>
                        <p>Reason: {appointment.reason}</p>
                      </div>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                      <Button
                        variant="danger"
                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
