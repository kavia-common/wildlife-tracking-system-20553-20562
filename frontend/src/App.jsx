import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BearsList from './pages/BearsList';
import AddBear from './pages/AddBear';
import EditBear from './pages/EditBear';
import BearDetail from './pages/BearDetail';

/**
 * Root application with routes, auth context, and protected pages.
 */
export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-ocean-gradient">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bears" element={<BearsList />} />
            <Route path="/bears/new" element={<AddBear />} />
            <Route path="/bears/:id" element={<BearDetail />} />
            <Route path="/bears/:id/edit" element={<EditBear />} />
            <Route path="/alerts" element={<div className="pt-2"><AlertsLazy /></div>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="ocean-card p-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Not Found</h1>
        <p className="text-gray-600">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

const AlertsLazy = React.lazy(() => import('./pages/Alerts.jsx'));
