import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.tsx';
import SubMenu from '../SubPages/SubMenu.tsx';
import SubPageLayoutProps from '../../interfaces/SubPageLayoutProps.ts';

/**
 * SubPageLayout component is used to structure the layout of subpages.

 *
 * @param {React.ReactNode} children - The child elements to be rendered within the layout.
 *
 */
const SubPageLayout: React.FC<SubPageLayoutProps> = ({ children }) => {
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });
  const location = useLocation();

  // Function to determine the header text based on the route
  const getHeaderText = () => {
    if (location.pathname.includes('race')) return 'Race';
    if (location.pathname.includes('class')) return 'Class';
    if (location.pathname.includes('abilityscore')) return 'Ability Scores';
    return '';
  };

  return (
    <>
      <Navbar />
      <main className="main items-center xl:bg-subPage xl:bg-cover bg-center min-h-screen">
        <div className="hidden xl:block absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-[10%] bg-black"></div>
          <div className="absolute top-[10%] left-0 w-full h-[10%] bg-gradient-to-b from-black to-black/50"></div>
          <div className="absolute top-[20%] left-0 w-full h-[80%] bg-black opacity-50"></div>
        </div>

        <section className="py-40 w-3/4 flex flex-col items-center gap-36">
          {isLargeScreen ? <SubMenu /> : <h1 className="header bold z-10">{getHeaderText()}</h1>}
          {children}
        </section>
      </main>
    </>
  );
};

export default SubPageLayout;
