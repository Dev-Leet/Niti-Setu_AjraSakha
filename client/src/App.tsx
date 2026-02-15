import React, { useEffect } from 'react';
import { ErrorBoundary } from '@components/common/ErrorBoundary/ErrorBoundary';
import { AppRoutes } from './routes';
import { ThemeProvider } from '@/context/ThemeContext';
import './styles/global.css';

const App: React.FC = () => {
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;