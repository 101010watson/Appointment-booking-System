import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Login = ({ onNavigateToSignup }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn({ email, password, rememberMe });
    } catch (error) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#EFF6FF'
    }}>
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Login Panel */}
        <div style={{ 
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)'
        }}>
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
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => navigate('/forgot-password')}
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
                  onClick={() => navigate('/signup')}
                  fullWidth
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Image Half */}
        <div style={{ 
          flex: 1, 
          position: 'relative',
          backgroundColor: '#EFF6FF'
        }}>
          <nav style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: '1rem'
          }}>
            <ul style={{
              display: 'flex',
              gap: '1.5rem',
              color: '#1e40af',
              fontWeight: '600'
            }}>
              <li 
                style={{ 
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#2563eb'}
                onMouseOut={(e) => e.target.style.color = '#1e40af'}
                onClick={() => navigate('/')}
              >
                Home
              </li>
              <li 
                className="cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => navigate('/about')}
              >
                About Us
              </li>
            </ul>
          </nav>
          <img
            src="/images/back2.png"
            alt="Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        height: '2.5rem',
        backgroundColor: 'rgba(219, 234, 254, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1e40af',
        fontSize: '0.875rem',
        borderTop: '1px solid #bfdbfe',
        backdropFilter: 'blur(8px)'
      }}>
        © 2025 mini-project. All rights preserved
      </footer>
    </div>
  );
};
