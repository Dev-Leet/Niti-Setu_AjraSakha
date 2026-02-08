import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { ErrorBoundary } from '@components/common/ErrorBoundary/ErrorBoundary';
import { AppRoutes } from './routes';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;