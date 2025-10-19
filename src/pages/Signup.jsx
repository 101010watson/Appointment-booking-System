import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Calendar } from 'lucide-react';


export const Signup = ({ onNavigateToLogin }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: '',
    phone: '',
    specialization: '',
    license_number: '',
    date_of_birth: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.role) {
      setError('Please select a role');
      return;
    }

    if (formData.role === 'doctor' && !formData.specialization) {
      setError('Specialization is required for doctors');
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        full_name: formData.full_name,
        role: formData.role,
        phone: formData.phone || null,
      };

      if (formData.role === 'doctor') {
        profileData.specialization = formData.specialization;
        profileData.license_number = formData.license_number || null;
      }

      if (formData.role === 'patient' && formData.date_of_birth) {
        profileData.date_of_birth = formData.date_of_birth;
      }

      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.full_name,
        role: formData.role,
        phone: formData.phone,
        specialization: formData.specialization,
        licenseNumber: formData.license_number,
        dateOfBirth: formData.date_of_birth
      };

      await signUp(userData);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Calendar className="text-blue-600" size={64} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">Join our hospital appointment system</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm your password"
              required
            />

            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'patient', label: 'Patient' },
                { value: 'doctor', label: 'Doctor' },
              ]}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />

            {formData.role === 'doctor' && (
              <>
                <Input
                  label="Specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  placeholder="e.g., Cardiology, Pediatrics"
                  required
                />

                <Input
                  label="License Number"
                  type="text"
                  value={formData.license_number}
                  onChange={(e) =>
                    setFormData({ ...formData, license_number: e.target.value })
                  }
                  placeholder="Enter your medical license number"
                />
              </>
            )}

            {formData.role === 'patient' && (
              <Input
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
              />
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full mb-4">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
