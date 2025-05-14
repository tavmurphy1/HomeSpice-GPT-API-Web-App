import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const ProtectedRoute: React.FC = () => {
  const user = auth.currentUser;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;