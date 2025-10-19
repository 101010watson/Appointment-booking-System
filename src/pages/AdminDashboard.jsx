import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
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
      const data = await apiService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await apiService.deleteAppointment(appointmentId);
      loadAppointments();
    } catch (error) {
      alert('Error deleting appointment: ' + error.message);
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      await apiService.updateAppointment(appointmentId, { status });
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

      <div className="mb-6 flex space-x-3">
        <Button
          variant={activeTab === 'overview' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'appointments' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </Button>
        <Button
          variant={activeTab === 'users' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </Button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center space-x-3">
              <Users className="text-blue-600" size={32} />
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center space-x-3">
              <Calendar className="text-green-600" size={32} />
              <div>
                <p className="text-gray-600 text-sm">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center space-x-3">
              <Activity className="text-yellow-600" size={32} />
              <div>
                <p className="text-gray-600 text-sm">Pending Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {appointments.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500">No appointments found.</p>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment._id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Patient</p>
                        <p className="font-semibold">{appointment.patient?.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Doctor</p>
                        <p className="font-semibold">Dr. {appointment.doctor?.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-semibold">
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateAppointmentStatus(appointment._id, e.target.value)
                      }
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteAppointment(appointment._id)}
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

      {activeTab === 'users' && (
        <div className="space-y-6">
          {users.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500">No users found.</p>
            </Card>
          ) : (
            users.map((user) => (
              <Card key={user._id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold">{user.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                      {user.phone && (
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold">{user.phone}</p>
                        </div>
                      )}
                      {user.specialization && (
                        <div>
                          <p className="text-sm text-gray-600">Specialization</p>
                          <p className="font-semibold">{user.specialization}</p>
                        </div>
                      )}
                    </div>
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
