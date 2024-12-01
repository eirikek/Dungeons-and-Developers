import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../CustomButton/CustomButton.tsx';

const SubMenu = () => {
  const location = useLocation();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const isActive = (linkTo: string) => location.pathname === linkTo;

  return (
    <section className="flex w-full h-30 justify-center items-center text-center z-10 space-x-5">
      {/* Race Button */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out flex items-center justify-center ${
          isActive('/race') ? 'bold' : ''
        } ${hoveredButton === '/race' || (!hoveredButton && isActive('/race')) ? 'flex-grow-2' : ''}`}
        onMouseEnter={() => setHoveredButton('/race')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <Button text="Race" linkTo="/race" noUnderline={true} className="header w-full justify-center" />
      </div>
      <div className="h-14 w-0.5 bg-customRed"></div>

      {/* Class Button */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out flex items-center justify-center ${
          isActive('/class') ? 'bold' : ''
        } ${hoveredButton === '/class' || (!hoveredButton && isActive('/class')) ? 'flex-grow-2' : ''}`}
        onMouseEnter={() => setHoveredButton('/class')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <Button text="Class" linkTo="/class" noUnderline={true} className="header w-full justify-center" />
      </div>
      <div className="h-14 w-0.5 bg-customRed"></div>

      {/* Ability Scores Button */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out flex items-center justify-center ${
          isActive('/abilityscore') ? 'bold' : ''
        } ${hoveredButton === '/abilityscore' || (!hoveredButton && isActive('/abilityscore')) ? 'flex-grow-2' : ''}`}
        onMouseEnter={() => setHoveredButton('/abilityscore')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <Button
          text="Ability scores"
          linkTo="/abilityscore"
          noUnderline={true}
          className="header w-full justify-center"
        />
      </div>
    </section>
  );
};

export default SubMenu;
