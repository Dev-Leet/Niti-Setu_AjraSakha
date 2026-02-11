import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { ErrorBoundary } from '@components/common/ErrorBoundary/ErrorBoundary';
import { AppRoutes } from './routes';
import { ThemeProvider } from '@/context/ThemeContext';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Provider store={store}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;