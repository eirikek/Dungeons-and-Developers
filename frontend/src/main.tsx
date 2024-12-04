import { ApolloProvider } from '@apollo/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import client from './client/apollo.ts';
import ToastProvider from './components/Toast/CustomToast.tsx';
import { AccessibilityProvider } from './context/AccessibilityContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import './index.css';

// initialize React query client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  // Provide Apollo Client for GraphQL queries and mutations
  <ApolloProvider client={client}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <AccessibilityProvider>
              <App />
            </AccessibilityProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  </ApolloProvider>
);
