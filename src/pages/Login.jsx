import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Calendar } from 'lucide-react';

export const Login = ({ onNavigateToSignup }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Calendar className="text-blue-600" size={64} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hospital Appointment System
          </h1>
          <p className="text-gray-600">Sign in to manage your appointments</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full mb-4">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
