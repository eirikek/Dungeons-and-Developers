import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.tsx';
import MainPageLayoutProps from '../../interfaces/MainPageLayoutProps.ts';

/**
 * MainPageLayout component manages the layout for the main pages
 *
 *
 * @param {React.ReactNode} children - The child elements to be rendered within the layout.
 * @param {boolean} isLoginTransition - Boolean value that checks if it will be a curtain drop or not.
 */

const MainPageLayout = ({ children, isLoginTransition = false }: MainPageLayoutProps) => {
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
    return (
      <>
        {location.pathname !== '/' && <Navbar />}
        {children}
      </>
    );
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
      {location.pathname !== '/' && <Navbar />}
      {motionWrapper}
    </>
  );
};

export default MainPageLayout;
