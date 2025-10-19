import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await apiService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await apiService.updateAppointment(appointmentId, { status: newStatus });
      loadAppointments();
    } catch (error) {
      alert('Error updating appointment: ' + error.message);
    }
  };

  const handleAddNotes = (appointmentId, currentNotes = '') => {
    setEditingNotes(appointmentId);
    setNotesText(currentNotes);
  };

  const handleSaveNotes = async (appointmentId) => {
    try {
      await apiService.updateAppointment(appointmentId, { notes: notesText });
      setEditingNotes(null);
      setNotesText('');
      loadAppointments();
    } catch (error) {
      alert('Error saving notes: ' + error.message);
    }
  };

  const handleCancelNotes = () => {
    setEditingNotes(null);
    setNotesText('');
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

  const filteredAppointments = appointments.filter((apt) =>
    filter === 'all' ? true : apt.status === filter
  );

  const upcomingCount = appointments.filter((apt) => apt.status === 'confirmed').length;
  const pendingCount = appointments.filter((apt) => apt.status === 'pending').length;

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Total Appointments</p>
            <p className="text-4xl font-bold text-blue-600">{appointments.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Pending Appointments</p>
            <p className="text-4xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Upcoming Confirmed</p>
            <p className="text-4xl font-bold text-green-600">{upcomingCount}</p>
          </div>
        </Card>
      </div>

      <div className="mb-6 flex space-x-3">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'secondary'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'confirmed' ? 'primary' : 'secondary'}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'secondary'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      <div className="grid gap-6">
        {filteredAppointments.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500">
              No {filter !== 'all' ? filter : ''} appointments found.
            </p>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment._id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="text-blue-600" size={20} />
                      <h3 className="text-lg font-semibold">
                        {appointment.patient?.fullName}
                      </h3>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {appointment.patient?.email && (
                        <div className="flex items-center space-x-2">
                          <Mail size={16} />
                          <span>{appointment.patient.email}</span>
                        </div>
                      )}
                      {appointment.patient?.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone size={16} />
                          <span>{appointment.patient.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Reason:</span>{' '}
                        {appointment.reason}
                      </p>
                      {appointment.notes && !editingNotes && (
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-medium">Notes:</span>{' '}
                          {appointment.notes}
                        </p>
                      )}
                      
                      {editingNotes === appointment._id && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes:
                          </label>
                          <textarea
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter notes for this appointment..."
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleSaveNotes(appointment._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelNotes}
                              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {appointment.status === 'pending' && (
                    <Button
                      variant="success"
                      onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}
                    >
                      Confirm
                    </Button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button
                      variant="success"
                      onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {(appointment.status === 'pending' ||
                    appointment.status === 'confirmed') && (
                    <Button
                      variant="danger"
                      onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => handleAddNotes(appointment._id, appointment.notes)}
                  >
                    {appointment.notes ? 'Edit Notes' : 'Add Notes'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
