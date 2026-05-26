import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { CaseManagerDashboard } from './components/CaseManagerDashboard';
import { AboutPage } from './components/AboutPage';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const { currentUser, login, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateTo = (page: string) => {
    if (page === 'dashboard') {
      navigate(currentUser ? `/${currentUser.role}` : '/login');
    } else {
      navigate(`/${page}`);
    }
  };

  const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: string }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (currentUser.role !== role) return <Navigate to={`/${currentUser.role}`} replace />;
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/login" element={
        !currentUser ? <LoginPage onLogin={(user) => { 
          login(user); 
          navigate(`/${user.role}`); 
        }} /> : <Navigate to={`/${currentUser.role}`} replace />
      } />

      <Route path="/patient" element={
        <ProtectedRoute role="patient">
          <PatientDashboard user={currentUser!} onLogout={handleLogout} onNavigate={navigateTo as any} />
        </ProtectedRoute>
      } />

      <Route path="/doctor" element={
        <ProtectedRoute role="doctor">
          <DoctorDashboard user={currentUser!} onLogout={handleLogout} onNavigate={navigateTo as any} />
        </ProtectedRoute>
      } />

      <Route path="/caseManager" element={
        <ProtectedRoute role="caseManager">
          <CaseManagerDashboard user={currentUser!} onLogout={handleLogout} onNavigate={navigateTo as any} />
        </ProtectedRoute>
      } />

      <Route path="/about" element={
        !currentUser ? <Navigate to="/login" replace /> : <AboutPage onNavigate={navigateTo as any} onLogout={handleLogout} />
      } />

      <Route path="*" element={<Navigate to={currentUser ? `/${currentUser.role}` : "/login"} replace />} />
    </Routes>
  );
}
