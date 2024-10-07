import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import HomePage from './pages/HomePage/Home.tsx';
import DungeonPage from './pages/dungeonPage/DungeonPage.tsx';
import EquipmentPage from './pages/equipmentPage/equipmentPage.tsx';
import MyCharacterPage from './pages/myCharacterPage/MyCharacterPage.tsx';
import MonsterPage from './pages/monsterPage/MonsterPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/project2" element={<LoginPage />} />
        <Route path="/project2/home" element={<HomePage />} />
        <Route path="/project2/dungeon" element={<DungeonPage />} />
        <Route path="/project2/equipment" element={<EquipmentPage />} />
        <Route path="/project2/MyCharacter" element={<MyCharacterPage />} />
        <Route path="/project2/monsters" element={<MonsterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
