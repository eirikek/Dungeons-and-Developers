import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import DungeonPage from './pages/dungeonPage/DungeonPage.tsx';
import EquipmentPage from './pages/equipmentPage/equipmentPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/project2" element={<LoginPage />} />
        <Route path="/project2/dungeon" element={<DungeonPage />} />
        <Route path="/project2/equipment" element={<EquipmentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
