import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AboutUs } from './pages/AboutUs';
import { ForgotPassword } from './pages/ForgotPassword';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {!user || !profile ? (
          <>
            <Route path="/login" element={<Login onNavigateToSignup={() => setShowSignup(true)} />} />
            <Route path="/signup" element={<Signup onNavigateToLogin={() => setShowSignup(false)} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={
              <>
                <Navbar />
                {profile.role === 'patient' && <PatientDashboard />}
                {profile.role === 'doctor' && <DoctorDashboard />}
                {profile.role === 'admin' && <AdminDashboard />}
              </>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );

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
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
