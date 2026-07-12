import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/providers/AuthProvider';
import { LayoutProvider } from '@/providers/LayoutProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import AppRoutes from '@/routes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LayoutProvider>
            {/* Core application routes */}
            <AppRoutes />

            {/* Global premium Toast alerts configuration */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--color-brand-card)',
                  color: 'var(--color-slate-800)',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '12px',
                  border: '1px solid var(--color-slate-200)',
                  boxShadow: 'var(--shadow-premium-md)',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: '#16A34A',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#DC2626',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </LayoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
