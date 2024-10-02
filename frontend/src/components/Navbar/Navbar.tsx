import { useState, useEffect } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../../../public/dnd-icon.ico';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the mobile menu when switching to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Prevent scrolling when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Scroll detection to hide/show the navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

      // Ignore scroll events when at the top/bottom of the page
      if (currentScrollY <= 0 || currentScrollY >= maxScrollY) {
        return;
      }

      // Threshold to avoid minor scroll changes, like the bouncing effect when scrolling to bottom/top in safari
      const scrollThreshold = 10;

      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
        return;
      }

      if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`${
          showNavbar ? 'top-0' : '-top-20'
        } fixed left-0 w-full bg-customRed text-white lg:p-5 p-2 z-50 transition-all duration-300 ease-in-out`}
      >
        <div className="container mx-auto flex justify-between items-center px-8">
          <img src={logo} alt="Dungeons & Developers logo" className="h-9 lg:hidden" />

          {/* Hamburger Icon */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="text-3xl p-2">
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Menu for large screens */}
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
        className={`fixed top-0 right-0 h-full w-64 bg-customRed text-white transition-transform transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden pl-4 pt-10 z-50`}
      >
        <button onClick={toggleMenu} className="absolute top-4 right-11 text-3xl">
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

      {/* Blur effect on background when slide-in menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40 transition-opacity duration-300 ease-in-out"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;