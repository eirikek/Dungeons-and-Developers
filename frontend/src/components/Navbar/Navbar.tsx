import { useState, useEffect } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaChevronDown } from 'react-icons/fa';
import logo from '../../../public/dnd-icon.ico';
import Button from '../Button/Button.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

      if (currentScrollY <= 0 || currentScrollY >= maxScrollY) {
        return;
      }

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
        } fixed left-0 w-full bg-customRed text-white xl:p-5 p-2 z-50 transition-all duration-300 ease-in-out`}
      >
        <div className="container mx-auto flex justify-between items-center px-8">
          <img src={logo} alt="Dungeons & Developers logo" className="h-9 lg:hidden shadow-none" />

          {/* Hamburger Icon */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-3xl p-2"
              aria-expanded={isOpen ? 'true' : 'false'}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Menu for large screens */}
          <div className="hidden lg:flex justify-between container">
            <Button text={'Monsters'} linkTo={'#'} />
            <Button text={'Dungeon'} linkTo={'#'} />

            <div
              className="relative"
              onMouseEnter={() => setIsDropdownHovered(true)}
              onMouseLeave={() => setIsDropdownHovered(false)}
            >
              <Button
                text={'My character'}
                linkTo={'#'}
                className={`flex items-center space-x-3 ${
                  isDropdownHovered ? 'no-underline' : ''
                }`}
              >
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    isDropdownHovered ? 'rotate-180' : ''
                  }`}
                />
              </Button>

              {/* Dropdown menu */}
              <div
                className={`absolute py-10 px-10 w-72 bg-customRed rounded overflow-hidden duration-300 ease-in-out max-h-0 ${
                  isDropdownHovered ? 'max-h-72 opacity-100' : 'opacity-0'
                }`}
              >
                <ul className="flex flex-col gap-10">
                  <li className="w-fit">
                    <Button text={'Races'} linkTo={'#'} />
                  </li>
                  <li className="w-fit">
                    <Button text={'Classes'} linkTo={'#'} />
                  </li>
                  <li className="w-fit">
                    <Button text={'Ability Scores'} linkTo={'#'} />
                  </li>
                </ul>
              </div>
            </div>

            <Button text={'Log out'}>
              <IoIosLogOut className="ml-2 mt-0.5" />
            </Button>
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
            <Button text={'Monsters'} linkTo={'#'} className="text-xl" />
          </li>
          <li>
            <Button text={'Dungeon'} linkTo={'#'} className="text-xl" />
          </li>

          <li>
            <div className="space-y-2">
              <div className="flex justify-between text-xl">
                My character
                <FaChevronDown
                  onClick={toggleMobileDropdown}
                  className={`transition-transform duration-300 ${
                    isMobileDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>

              {isMobileDropdownOpen && (
                <ul className="space-y-2 pl-4">
                  <li>
                    <Button text={'Races'} linkTo={'#'} className="px-4 py-2" noUnderline={true} />
                  </li>
                  <li>
                    <Button text={'Classes'} linkTo={'#'} className="px-4 py-2" noUnderline={true} />
                  </li>
                  <li>
                    <Button text={'Ability Scores'} linkTo={'#'} className="px-4 py-2" noUnderline={true} />
                  </li>
                </ul>
              )}
            </div>
          </li>

          <li>
            <div className="text-xl flex items-center">
              Log out
              <IoIosLogOut className="ml-2 mt-1" />
            </div>
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