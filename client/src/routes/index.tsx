import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
//import { useAuth } from '@hooks/useAuth';
import { Layout } from '@components/layout/Layout/Layout';
import { Home } from '@pages/Home/Home';
import Auth from '@pages/Auth/Auth';
import { ProfileInput } from '@pages/ProfileInput/ProfileInput';
import { Results } from '@pages/Results/Results';
import { Dashboard } from '@pages/Dashboard/Dashboard';
import { Schemes } from '@pages/Schemes/Schemes';
import { SchemeDetail } from '@pages/SchemeDetail/SchemeDetail';
import { useAppSelector } from '@/store/hooks';
import { AsyncErrorBoundary } from '@components/common/ErrorBoundary/AsyncErrorBoundary';
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/auth" element={<Auth />} />
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