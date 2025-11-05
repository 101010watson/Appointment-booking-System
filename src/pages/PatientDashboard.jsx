import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { appointments as appointmentsApi, doctors as doctorsApi } from '../lib/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Calendar, Clock, User, X } from 'lucide-react';

export const PatientDashboard = () => {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
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
      const data = await appointmentsApi.list();
      setAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await doctorsApi.list();
      setDoctors(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await appointmentsApi.create(
        formData.doctor_id,
        formData.appointment_date,
        formData.appointment_time,
        formData.reason
      );

      setFormData({
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
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
      await appointmentsApi.update(appointmentId, 'cancelled', null);
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
              value={formData.doctor_id}
              onChange={(e) =>
                setFormData({ ...formData, doctor_id: e.target.value })
              }
              options={doctors.map((doc) => ({
                value: doc.id,
                label: `Dr. ${doc.full_name} - ${doc.specialization || 'General'}`,
              }))}
              required
            />

            <Input
              label="Appointment Date"
              type="date"
              value={formData.appointment_date}
              onChange={(e) =>
                setFormData({ ...formData, appointment_date: e.target.value })
              }
              required
            />

            <Input
              label="Appointment Time"
              type="time"
              value={formData.appointment_time}
              onChange={(e) =>
                setFormData({ ...formData, appointment_time: e.target.value })
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
            <Card key={appointment.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold">
                      Dr. {appointment.doctor?.full_name}
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
                      <span>{appointment.appointment_date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{appointment.appointment_time}</span>
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
                    onClick={() => handleCancelAppointment(appointment.id)}
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
