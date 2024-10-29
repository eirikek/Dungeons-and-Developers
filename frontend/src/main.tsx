import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import client from './client/apollo.ts';
import { ApolloProvider } from '@apollo/react-hooks';
import { AuthProvider } from './context/AuthContext.tsx';
import { DungeonProvider } from './context/DungeonContext.tsx';


const queryClient = new QueryClient();
const userId = localStorage.getItem('userId') || '';

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DungeonProvider userId={userId}>
            <App />
          </DungeonProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  </ApolloProvider>,
);