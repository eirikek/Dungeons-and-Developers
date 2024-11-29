import { ApolloProvider } from '@apollo/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import client from './client/apollo.ts';
import ToastProvider from './components/Toast/CustomToast.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CharacterProvider } from './context/CharacterContext.tsx';
import { DungeonProvider } from './context/DungeonContext.tsx';
import { AccessibilityProvider } from './context/AccessibilityContext.tsx';
import './index.css';

const queryClient = new QueryClient();
const userId = localStorage.getItem('userId') || '';

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <CharacterProvider userId={userId}>
              <DungeonProvider userId={userId}>
                <AccessibilityProvider>
                  <App />
                </AccessibilityProvider>
              </DungeonProvider>
            </CharacterProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  </ApolloProvider>
);
