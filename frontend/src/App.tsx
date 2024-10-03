import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import DungeonPage from './pages/dungeonPage/DungeonPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/project2" element={<LoginPage />} />
        <Route path="/project2/dungeon" element={<DungeonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
