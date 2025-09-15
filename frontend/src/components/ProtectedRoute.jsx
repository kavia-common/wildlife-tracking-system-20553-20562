import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Protect routes by redirecting unauthenticated users to /login.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
