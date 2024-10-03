import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import App from './pages/App/App.tsx';
import './index.css';
import DungeonPage from './pages/dungeonPage/DungeonPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DungeonPage />
  </StrictMode>
);
