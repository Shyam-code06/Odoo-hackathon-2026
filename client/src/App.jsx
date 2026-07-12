import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/providers/AuthProvider';
import { LayoutProvider } from '@/providers/LayoutProvider';
import AppRoutes from '@/routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutProvider>
          {/* Core application routes */}
          <AppRoutes />

          {/* Global premium Toast alerts configuration */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#1E293B',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: '12px',
                border: '1px solid #EEF2F7',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 10px 15px -3px rgba(0,0,0,0.03)',
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
    </BrowserRouter>
  );
}

export default App;
