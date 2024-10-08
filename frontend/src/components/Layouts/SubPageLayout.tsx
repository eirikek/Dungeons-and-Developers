import React from 'react';
import Navbar from '../Navbar/Navbar.tsx';

interface SubPageLayoutProps {
  children: React.ReactNode;
}

const SubPageLayout: React.FC<SubPageLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-5">
        {children}
      </div>
    </>
  );
};

export default SubPageLayout;