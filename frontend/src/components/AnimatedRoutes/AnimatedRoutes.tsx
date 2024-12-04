import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import DungeonPage from '../../pages/mainPages/dungeonPage.tsx';
import HomePage from '../../pages/mainPages/homePage.tsx';
import LoginPage from '../../pages/mainPages/loginPage.tsx';
import MonsterPage from '../../pages/mainPages/monsterPage.tsx';
import MyCharacterPage from '../../pages/mainPages/myCharacterPage.tsx';
import AbilityScorePage from '../../pages/subPages/abilityScorePage.tsx';
import ClassPage from '../../pages/subPages/classPage.tsx';
import EquipmentPage from '../../pages/subPages/equipmentPage.tsx';
import RacePage from '../../pages/subPages/racePage.tsx';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute.tsx';
import { CharacterProvider } from '../../context/CharacterContext.tsx';
import { DungeonProvider } from '../../context/DungeonContext.tsx';

export default function AnimatedRoutes() {
  const location = useLocation();

  const userId = localStorage.getItem('userId') || '';

  // Scroll to the top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppRoutes userId={userId} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );

  function AppRoutes({ userId }: { userId: string }) {
    return (
      <Routes>
        <Route path="/home" element={<HomePage />} />

        {/* Character-related Routes */}
        <Route
          element={
            <CharacterProvider userId={userId}>
              <Outlet />
            </CharacterProvider>
          }
        >
          <Route path="/class" element={<ClassPage />} />
          <Route path="/race" element={<RacePage />} />
          <Route path="/abilityscore" element={<AbilityScorePage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/mycharacter" element={<MyCharacterPage />} />
        </Route>

        {/* Dungeon-related Routes */}
        <Route
          element={
            <DungeonProvider userId={userId}>
              <Outlet />
            </DungeonProvider>
          }
        >
          <Route path="/monsters" element={<MonsterPage />} />
          <Route path="/dungeon" element={<DungeonPage />} />
        </Route>
      </Routes>
    );
  }
}
