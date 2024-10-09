import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useEquipments from '../../hooks/useEquipments.ts';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300, // Enter from left if next, right if previous
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300, // Exit to left if next, right if previous
    opacity: 0,
  }),
};

const EquipmentPage: React.FC = () => {
  const results = useEquipments();

  const itemsPerPage = 20;
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1); // +1 for next, -1 for previous

  // Pagination function to handle page navigation and set the direction
  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentPage((prevPage) => (prevPage + newDirection + totalPages) % totalPages);
  };

  const currentEquipment = results.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );


  return (
    <MainPageLayout>
      <main
        className="relative flex flex-col items-center justify-center min-h-screen w-full z-0 before:absolute before:inset-0 before:bg-equipments before:bg-cover before:bg-center before:z-0">
        <div className="absolute inset-0 w-full h-full bg-black opacity-70" />
        <div
          className="flex flex-col py-10 text-white min-h-[calc(100vh-100px)] min-w-[70%] z-10 mt-24 justify-between items-center">
          <h1 className="text-4xl">Equipments</h1>

          {/* Equipment Grid */}
          <section className="w-full h-9/10 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                className="grid grid-cols-4 gap-x-20 gap-y-16 w-full"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {currentEquipment.map((equip, index) => (
                  <div key={index} className="flex items-center">
                    <input type="checkbox" className="mr-4 cursor-pointer min-w-8 min-h-8 accent-customRed" />
                    <span className="text-xl">{equip.name}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Pagination Controls */}
          <section className="flex justify-center gap-40 w-full text-xl mt-10">
            <button
              className="flex items-center hover:text-gray-400 w-44"
              onClick={() => paginate(-1)}
              disabled={currentPage === 0}
            >
              <FaChevronLeft className="mr-2" />
              Previous Page
            </button>
            <span className="w-2 text-center">{currentPage + 1}</span>
            <button
              className="flex items-center hover:text-gray-400 w-44"
              onClick={() => paginate(1)}
            >
              Next Page
              <FaChevronRight className="ml-2" />
            </button>
          </section>
        </div>
      </main>
    </MainPageLayout>
  );
};
export default EquipmentPage;