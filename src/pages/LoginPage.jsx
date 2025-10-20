import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const LoginPage = ({ onNavigateToSignup }) => {
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
      await signIn({ email, password });
    } catch (error) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Login Panel */}
        <div className="flex-1 bg-white p-8 flex flex-col justify-center items-center relative">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
              Book an Appointment <br />Right Now!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm" role="alert">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-gray-600">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600 mr-2"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  fullWidth
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onNavigateToSignup}
                  fullWidth
                >
                  Sign Up
                </Button>
              </div>

              <div className="text-center text-gray-600">
                or login with{" "}
                <a href="#" className="text-blue-600 font-semibold">
                  Google
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Image Half */}
        <div className="flex-1 relative">
          <nav className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <ul className="flex gap-6 text-white">
              <li className="cursor-pointer hover:text-blue-400 transition-colors">
                Home
              </li>
              <li className="cursor-pointer hover:text-blue-400 transition-colors">
                About Us
              </li>
              <li className="cursor-pointer hover:text-blue-400 transition-colors">
                Source Code
              </li>
            </ul>
          </nav>
          <img
            src="/images/back.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="h-10 bg-gray-100 flex items-center justify-center text-gray-600 text-sm border-t border-gray-200">
        © 2025 mini-project. All rights preserved
      </footer>
    </div>
  );
};