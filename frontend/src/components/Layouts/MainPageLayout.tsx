import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.tsx';
import { useLocation } from 'react-router-dom';

interface MainPageLayoutProps {
  children: React.ReactNode;
  isLoginTransition?: boolean;
}

const MainPageLayout: React.FC<MainPageLayoutProps> = ({ children, isLoginTransition = false }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Disable page transitions on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    if (isLoginTransition) {
      // fade in/out only for login/logout transitions
      return (
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {location.pathname !== '/project2' && <Navbar />}
          {children}
        </motion.div>
      );
    } else {
      // No animation for regular page transitions
      return (
        <>
          {location.pathname !== '/project2' && <Navbar />}
          {children}
        </>
      );
    }
  }


  const motionWrapper = (
    <motion.div
      key={location.pathname}
      initial="initialState"
      animate="animateState"
      exit="exitState"
      transition={{ duration: 0.4 }}
      variants={{
        initialState: {
          opacity: 0,
          ...(isLoginTransition
            ? {} // Skip clipPath for login/logout transition
            : {
              clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
              WebkitClipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
            }),
        },
        animateState: {
          opacity: 1,
          ...(isLoginTransition
            ? {}
            : {
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              WebkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            }),
        },
        exitState: {
          opacity: 0,
          ...(isLoginTransition
            ? {}
            : {
              clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
              WebkitClipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
            }),
        },
      }}
      style={{ WebkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', willChange: 'clip-path, opacity' }}
    >
      {children}
    </motion.div>
  );

  return (
    <>
      {location.pathname !== '/project2' && <Navbar />}
      {motionWrapper}
    </>
  );
};

export default MainPageLayout;