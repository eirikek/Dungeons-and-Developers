import { motion } from 'framer-motion';
import React from 'react';
import Navbar from '../Navbar/Navbar.tsx';
import { useLocation } from 'react-router-dom';

const MainPageLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <motion.div
        key={location.pathname}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{ duration: 0.4 }}
        variants={{
          initialState: {
            opacity: 0,
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)', // Start clipped in the center
          },
          animateState: {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', // Expanding outward to full screen
          },
          exitState: {
            opacity: 0,
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)', // Clipping inward to center
          },
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default MainPageLayout;