import { motion } from 'framer-motion';
import React from 'react';
import Navbar from '../Navbar/Navbar.tsx';
import { useLocation } from 'react-router-dom';

const MainPageLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isLoginPage = location.pathname === '/project2';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <motion.div
        key={location.pathname}
        initial={isLoginPage ? 'fadeInitial' : 'clipInitial'}
        animate={isLoginPage ? 'fadeAnimate' : 'clipAnimate'}
        exit={isLoginPage ? 'fadeExit' : 'clipExit'}
        transition={{ duration: 0.5 }}
        variants={{
          // ClipPath animations for all other pages
          clipInitial: {
            opacity: 0,
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)', // Clipped in the center
          },
          clipAnimate: {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', // Expanding to full screen
          },
          clipExit: {
            opacity: 0,
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)', // Clipping inward to center
          },
          // Fade animations for LoginPage
          fadeInitial: {
            opacity: 0,
            backgroundColor: 'black', // Fade starts with black
          },
          fadeAnimate: {
            opacity: 1,
            backgroundColor: 'transparent', // Fade into the page
          },
          fadeExit: {
            opacity: 0,
            backgroundColor: 'black', // Fade out to black
          },
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default MainPageLayout;