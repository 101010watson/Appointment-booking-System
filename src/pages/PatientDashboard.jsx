import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { DateInput } from '../components/DateInput';
import { TimeInput } from '../components/TimeInput';
import { Calendar, Clock, User, X } from 'lucide-react';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([loadAppointments(), loadDoctors()]);
    } catch (err) {
      console.error('Error loading data:', err);
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

  const loadDoctors = async () => {
    try {
      const data = await apiService.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError('');

    // Validate appointment date is not in the past
    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    const now = new Date();
    
    if (appointmentDateTime <= now) {
      setError('Cannot book appointments in the past. Please select a future date and time.');
      return;
    }

    try {
      const appointmentData = {
        doctor: formData.doctor,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
      };

      console.log('Form data:', formData);
      console.log('Appointment data being sent:', appointmentData);
      console.log('Doctor ID:', formData.doctor);
      console.log('Date:', formData.appointmentDate);
      console.log('Time:', formData.appointmentTime);
      
      await apiService.createAppointment(appointmentData);

      setFormData({
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
      });
      setShowBookingForm(false);
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await apiService.updateAppointment(appointmentId, { status: 'cancelled' });
      loadAppointments();
    } catch (err) {
      alert('Error cancelling appointment: ' + err.message);
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <Button onClick={() => setShowBookingForm(true)}>
          Book New Appointment
        </Button>
      </div>

      {showBookingForm && (
        <Card className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Book New Appointment</h2>
            <button onClick={() => setShowBookingForm(false)}>
              <X className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={handleBookAppointment}>
            <Select
              label="Select Doctor"
              value={formData.doctor}
              onChange={(e) =>
                setFormData({ ...formData, doctor: e.target.value })
              }
              options={doctors.map((doc) => ({
                value: doc._id,
                label: `Dr. ${doc.fullName} - ${doc.specialization || 'General'}`,
              }))}
              required
            />

            <DateInput
              label="Appointment Date"
              value={formData.appointmentDate}
              onChange={(e) =>
                setFormData({ ...formData, appointmentDate: e.target.value })
              }
              min={new Date().toISOString().split('T')[0]}
              required
            />

            <TimeInput
              label="Appointment Time"
              value={formData.appointmentTime}
              onChange={(e) =>
                setFormData({ ...formData, appointmentTime: e.target.value })
              }
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <Button type="submit">Book Appointment</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowBookingForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-6">
        {appointments.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500">
              No appointments yet. Book your first appointment!
            </p>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment._id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold">
                      Dr. {appointment.doctor?.fullName}
                    </h3>
                  </div>
                  {appointment.doctor?.specialization && (
                    <p className="text-sm text-gray-600 mb-2">
                      {appointment.doctor.specialization}
                    </p>
                  )}
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
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Reason:</span>{' '}
                    {appointment.reason}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status.toUpperCase()}
                  </span>
                </div>
                {appointment.status === 'pending' && (
                  <Button
                    variant="danger"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
