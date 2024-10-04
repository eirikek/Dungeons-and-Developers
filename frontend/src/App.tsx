import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import DungeonPage from './pages/dungeonPage/DungeonPage.tsx';
import MonsterPage from './pages/monsterPage/MonsterPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/project2" element={<LoginPage />} />
        <Route path="/project2/dungeon" element={<DungeonPage />} />
        <Route path="/project2/monsters" element={<MonsterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
