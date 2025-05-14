import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  console.log('[ProtectedRoute] loading:', loading, '| user:', user);

    // TO DO Could put a spinny wheel component here
  if (loading) {
    return <div>Loading...</div>; }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;