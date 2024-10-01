import { useState } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../../../public/dnd-icon.ico';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="absolute top-0 left-0 w-full bg-red-500 bg-opacity-75 text-white p-5 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <img src={logo} alt="Dungeons & Developers logo" className="h-12 lg:hidden" />

          {/* Hamburger Icon */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="text-4xl p-2">
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Menu for large screens*/}
          <div className="hidden lg:flex justify-between container">
            <button className="relative group text-3xl pb-1">
              Monsters
              <span
                className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </button>
            <button className="relative group text-3xl pb-1">
              Dungeons & Developers
              <span
                className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </button>
            <button className="relative group text-3xl pb-1">
              My profile
              <span
                className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </button>
            <button className="relative group text-3xl pb-1 flex items-center gap-2">
              Log out
              <IoIosLogOut />
              <span
                className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-in Menu for small screens */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-red-500 text-white  transition-transform transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden pl-4 pt-10 z-50`}
      >
        <button onClick={toggleMenu} className="absolute top-7 right-7 text-4xl">
          <FiX />
        </button>
        <ul className="mt-16 space-y-10">
          <li>
            <button className="text-xl">Monsters</button>
          </li>
          <li>
            <button className="text-xl">Dungeons & Developers</button>
          </li>
          <li>
            <button className="text-xl">My profile</button>
          </li>
          <li>
            <button className="text-xl flex items-center gap-2">
              Log out
              <IoIosLogOut />
            </button>
          </li>
        </ul>
      </div>

      {/* Blur effect for the background when the menu is open */}
      <div
        className={`fixed inset-0 transition-all duration-500 ${
          isOpen ? 'backdrop-blur-lg z-40 delay-50' : 'pointer-events-none'
        }`}
        onClick={toggleMenu}
      ></div>
    </>
  );
};

export default Navbar;