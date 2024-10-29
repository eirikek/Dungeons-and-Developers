import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { DungeonProvider } from './context/DungeonContext.tsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from './components/Toast/CustomToast.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <DungeonProvider>
          <App />
        </DungeonProvider>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>
);
