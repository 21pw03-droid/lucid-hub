/**
 * Main App Component - Routing and Providers
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RoleGuard } from './components/guards/RoleGuard';
import { Layout } from './components/layout/Layout';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';

// Staff pages
import StaffDashboard from './pages/staff/Dashboard';

// Client pages
import ClientDashboard from './pages/client/Dashboard';

// Import global styles
import './styles/global.css';

// Redirect component based on user role
const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'STAFF':
      return <Navigate to="/staff/dashboard" replace />;
    case 'CLIENT':
      return <Navigate to="/client/dashboard" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes with layout */}
          <Route element={<Layout />}>
            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <RoleGuard allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleGuard>
              }
            />
            <Route path="/admin/leads" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="/admin/users" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="/admin/projects" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="/admin/assignments" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />

            {/* Staff routes */}
            <Route
              path="/staff/dashboard"
              element={
                <RoleGuard allowedRoles={['STAFF']}>
                  <StaffDashboard />
                </RoleGuard>
              }
            />
            <Route path="/staff/projects" element={<RoleGuard allowedRoles={['STAFF']}><StaffDashboard /></RoleGuard>} />

            {/* Client routes */}
            <Route
              path="/client/dashboard"
              element={
                <RoleGuard allowedRoles={['CLIENT']}>
                  <ClientDashboard />
                </RoleGuard>
              }
            />
            <Route path="/client/projects" element={<RoleGuard allowedRoles={['CLIENT']}><ClientDashboard /></RoleGuard>} />
          </Route>

          {/* Dashboard redirect */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
