import { Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage/LoginPage.tsx';
import HomePage from '../../pages/HomePage/Home.tsx';
import DungeonPage from '../../pages/dungeonPage/DungeonPage.tsx';
import ClassPage from '../../pages/characterPages/ClassPage.tsx';
import RacePage from '../../pages/characterPages/RacePage.tsx';
import AbilityScorePage from '../../pages/characterPages/AbilityScorePage.tsx';
import EquipmentPage from '../../pages/equipmentPage/equipmentPage.tsx';
import MonsterPage from '../../pages/monsterPage/MonsterPage.tsx';
import MyCharacterPage from '../../pages/myCharacterPage/MyCharacterPage.tsx';
import { AnimatePresence } from 'framer-motion';

export default function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/project2" element={<LoginPage />} />
        <Route path="/project2/home" element={<HomePage />} />
        <Route path="/project2/dungeon" element={<DungeonPage />} />
        <Route path="/project2/class" element={<ClassPage />} />
        <Route path="/project2/race" element={<RacePage />} />
        <Route path="/project2/abilityscore" element={<AbilityScorePage />} />
        <Route path="/project2/equipment" element={<EquipmentPage />} />
        <Route path="/project2/monsters" element={<MonsterPage />} />
        <Route path="/project2/mycharacter" element={<MyCharacterPage />} />
      </Routes>
    </AnimatePresence>
  );
}