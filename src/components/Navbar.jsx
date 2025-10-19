import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { Calendar, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { profile, signOut } = useAuth(); // <-- no type annotations

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600" size={32} />
            <span className="text-xl font-bold text-gray-900">
              Hospital Appointment System
            </span>
          </div>

          {profile && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
              </div>
              <Button variant="secondary" onClick={handleSignOut}>
                <LogOut size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
