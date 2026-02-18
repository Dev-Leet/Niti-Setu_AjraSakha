import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { store } from '@/store';
import Login from '@/pages/Auth/Login';
 
describe('Auth Flow', () => {
  it('completes login flow', async () => {
    render(
      <Provider store={store}>
        {/* supply a no‑op toggle handler so TS is happy */}
+        <Login onToggle={() => { /* nothing */ }} />
      </Provider>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }); 
  });
});