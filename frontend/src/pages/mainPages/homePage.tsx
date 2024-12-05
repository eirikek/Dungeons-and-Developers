import text_logo from '../../assets/images/text_logo.png';
import characterImg from '../../assets/images/characters.webp';
import monstersImg from '../../assets/images/monsters.jpg';
import hammerImg from '../../assets/images/hammer.png';
import dragonGif from '../../assets/images/dragon.gif';
import favoriteImg from '../../assets/images/dungeon-gate.svg';
import Tilt from 'react-parallax-tilt';
import HomeSection from '../../components/Home/HomeSection.tsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useContext, useEffect, useState, useRef } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import { useToast } from '../../hooks/useToast.ts';
import { AuthContext } from '../../context/AuthContext.tsx';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

/**
 * HomePage Component
 *
 * Represents the homepage of the application, providing an immersive and interactive user experience.
 *
 * Features:
 * - Parallax animations for dynamic visuals using `react-parallax-tilt` and `framer-motion`.
 * - A multi-section layout highlighting different functionalities of the app.
 * - Toast notifications for login events using `useToast`.
 * - Interactive scrolling navigation:
 *    - Chevron-based navigation to scroll between sections.
 *
 *
 * Key Components:
 * - `MainPageLayout`: Provides the structural layout for the page.
 * - `HomeSection`: Displays the content and image for each feature section.
 * - `CustomInput`: Allows users to modify and save their dungeon name.
 * - `motion` animations: Adds visual appeal with animated elements like dragons and the chevron.
 *
 * Hooks:
 * - `useScroll` and `useTransform`: For scroll-based animations of dragon images.
 * - `useContext`: Retrieves user context to show personalized login messages.
 * - `useEffect`: Handles scroll detection, responsive resizing, and login toasts.
 * - `useRef`: Tracks sections for scroll-based navigation.
 *
 */

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const { userName } = useContext(AuthContext);
  const { showToast } = useToast();
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isBottom, setIsBottom] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleChevronClick = () => {
    if (!isScrolling) {
      setIsScrolling(true);

      if (!isBottom && currentSection < sectionsRef.current.length - 1) {
        const nextSection = sectionsRef.current[currentSection + 1];
        if (nextSection) {
          const offset = -100;
          const yPosition = nextSection.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top: yPosition, behavior: 'smooth' });
        }
        setCurrentSection(currentSection + 1);
      } else if (isBottom) {
        sectionsRef.current[0]?.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(0);
      }
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      const newSection = sectionsRef.current.findIndex((section) => {
        if (!section) return false;
        const { top, bottom } = section.getBoundingClientRect();
        const absoluteTop = top + window.scrollY;
        const absoluteBottom = bottom + window.scrollY;
        return scrollPosition >= absoluteTop && scrollPosition < absoluteBottom;
      });

      if (newSection !== -1 && newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection, isScrolling]);

  useEffect(() => {
    setIsBottom(currentSection === sectionsRef.current.length - 1);
  }, [currentSection]);

  useEffect(() => {
    const loginToast = localStorage.getItem('loginToast');

    if (userName && loginToast === 'true') {
      setTimeout(() => {
        showToast({
          message: `Welcome, ${userName}!`,
          type: 'info',
          duration: 3000,
        });
      }, 400);
      localStorage.setItem('loginToast', 'false');
    }
  }, [userName, showToast]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const dragon1X = useTransform(
    scrollYProgress,
    isMobile ? [0.35, 0.7] : [0.35, 0.65],
    isMobile ? ['-300%', '300%'] : ['-800%', '800%']
  );

  const dragon2X = useTransform(
    scrollYProgress,
    isMobile ? [0.65, 1] : [0.7, 1.0],
    isMobile ? ['300%', '-300%'] : ['800%', '-800%']
  );

  return (
    <MainPageLayout>
      <header
        ref={(el) => (sectionsRef.current[0] = el as HTMLDivElement)}
        className="w-full h-screen bg-home bg-cover bg-center bg-black bg-opacity-40 bg-blend-overlay flex items-center justify-center relative"
      >
        <section
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent 70%, black 100%)',
          }}
        ></section>

        <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} className="relative z-20 xl:w-1/2 md:w-3/4">
          <img src={text_logo} alt="text_logo" className="object-contain shadow-none w-full h-full p-8" />
        </Tilt>
      </header>
      <main className="w-full bg-black flex flex-col items-center py-48 xl:gap-36 gap-16 overflow-hidden">
        <HomeSection
          ref={(el: HTMLDivElement | null) => (sectionsRef.current[1] = el)}
          title="Create Your Character"
          text={
            <>
              <p className="mb-4">
                Build your unique character by selecting race, class, ability scores, and equipment.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Race: The race of your character determines their appearance, and sometimes even their background.
                </li>
                <li>
                  Class: The class defines your character’s role in the game, determining their skills and HP. Each
                  class specializes in different aspects of gameplay, like animal handling or survival.
                </li>
                <li>
                  Ability Scores: These scores define your character’s basic attributes These attributes affect
                  everything from how well your character fights to how well they interact with others in the game.
                </li>
                <li>
                  Equipment: Choose the weapons, armor, and gear your character will use during their adventure. From
                  swords and shields to magic wands and potions, your choice of equipment can significantly impact your
                  character’s effectiveness in combat and exploration. You can choose up to 10 equipments
                </li>
              </ul>
            </>
          }
          image={characterImg}
        />

        {/* First dragon animation from left to right */}
        <motion.img
          src={dragonGif}
          alt="dragon"
          className="md:w-44 w-32 invert shadow-none"
          style={{
            x: dragon1X,
            scaleX: -1,
          }}
        />

        <HomeSection
          ref={(el) => (sectionsRef.current[2] = el)}
          title="Explore Monsters"
          text={
            <>
              <p className="mb-4">
                Dive into a vast world of monsters where you can explore the abilities, stats, and behaviors of a wide
                range of creatures. Each monster comes with its own unique hit points, attack patterns, strengths, and
                weaknesses, providing detailed insight into how they perform in combat scenarios.
              </p>
              <p className="mb-4">
                In addition to exploring each monster’s attributes, you can also leave reviews on the monsters you
                encounter. Share your thoughts on how challenging the monsters are, your strategies for defeating them,
                and your overall experience. You can also browse through reviews left by other players to learn from
                their experiences and gain tips for future encounters.
              </p>
              <p>
                Whether you're preparing for your next campaign or simply curious, the monster database offers a
                treasure trove of information that will help you succeed in your adventures.
              </p>
            </>
          }
          image={monstersImg}
          reversed={true}
        />

        {/* Second dragon animation from right to left */}
        <motion.img
          src={dragonGif}
          alt="dragon"
          className="md:w-44 w-32 invert shadow-none"
          style={{
            x: dragon2X,
          }}
        />

        <HomeSection
          ref={(el) => (sectionsRef.current[3] = el)}
          title="Build Your Dungeon"
          text={
            <>
              <p className="mb-4">
                In this section, you can create your own dungeon by selecting monsters to defend it. While exploring the
                monster database, you can click the
                <span className="inline-block">
                  <img src={favoriteImg} alt="favorite" className="shadow-none md:w-8 w-6 mx-3"></img>
                </span>
                button next to any monster to add it to your dungeon. If you change your mind, you can also easily
                remove monsters from your dungeon to adjust your selection.
              </p>
              <p className="mb-4">
                You can select up to 6 monsters to populate your dungeon. Choose your monsters wisely—whether you want a
                balanced combination of brute strength and magic, or a lineup of agile, stealthy creatures, the choice
                is yours. Consider each monster’s abilities, strengths, and weaknesses to create a challenging
                experience for those who dare to explore your dungeon.
              </p>
            </>
          }
          image={hammerImg}
        />
      </main>
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
        onClick={handleChevronClick}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
      >
        {isBottom ? (
          <FaChevronUp className="hover:opacity-70" size={30} color="white" />
        ) : (
          <FaChevronDown className="hover:opacity-70" size={30} color="white" />
        )}
      </motion.div>
    </MainPageLayout>
  );
}
