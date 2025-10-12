import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) {
    return showSignup ? (
      <Signup onNavigateToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onNavigateToSignup={() => setShowSignup(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {profile.role === 'patient' && <PatientDashboard />}
        {profile.role === 'doctor' && <DoctorDashboard />}
        {profile.role === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
