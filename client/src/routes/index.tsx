import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Layout } from '@components/layout/Layout/Layout';
import { Home } from '@pages/Home/Home';
import { Login } from '@pages/Auth/Login';
import { Register } from '@pages/Auth/Register';
import { ProfileInput } from '@pages/ProfileInput/ProfileInput';
import { Results } from '@pages/Results/Results';
import { Dashboard } from '@pages/Dashboard/Dashboard';
import { Schemes } from '@pages/Schemes/Schemes';
import { SchemeDetail } from '@pages/SchemeDetail/SchemeDetail';
import { AsyncErrorBoundary } from '@components/common/ErrorBoundary/AsyncErrorBoundary';
 
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/schemes" element={<Layout><Schemes /></Layout>} />
      <Route path="/scheme/:id" element={<Layout><SchemeDetail /></Layout>} />
    
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout><ProfileInput /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Layout><Results /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <AsyncErrorBoundary>
            <Layout><Home /></Layout>
          </AsyncErrorBoundary>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};