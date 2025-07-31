import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminRoute = false }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (adminRoute) {
    if (!isAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } else {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;