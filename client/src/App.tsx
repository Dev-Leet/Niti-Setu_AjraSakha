import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@store/hooks';
import { clearAuth } from '@store/slices/authSlice';
import { ErrorBoundary } from '@components/common/ErrorBoundary/ErrorBoundary';
import { AppRoutes } from './routes';
import { ThemeProvider } from '@/context/ThemeContext';
import './styles/global.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(clearAuth());
      if (location.pathname !== '/auth') {
        navigate('/auth');
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch, navigate, location]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;