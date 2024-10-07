import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar.tsx';

const equipmentList = Array.from({ length: 100 }, (_, i) => `Equipment ${i + 1}`);

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

export default function EquipmentPage() {
  const itemsPerPage = 20;
  const totalPages = Math.ceil(equipmentList.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1); // +1 for next, -1 for previous

  // Pagination function to handle page navigation and set the direction
  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentPage((prevPage) => (prevPage + newDirection + totalPages) % totalPages);
  };

  const currentEquipment = equipmentList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <>
      <Navbar />
      <main
        className="relative flex flex-col items-center justify-center h-screen w-full z-0 before:absolute before:inset-0 before:bg-equipment_bg before:bg-cover before:bg-center before:z-0">
        <div
          className="flex flex-col justify-center items-center bg-black bg-opacity-70 text-white w-5/6 my-20 z-10 gap-20 p-16">
          <h1 className="text-4xl">Equipments</h1>

          {/* Equipment Grid */}
          <section className="w-full overflow-hidden flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                className="grid grid-cols-4 gap-x-52 gap-y-8"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {currentEquipment.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input type="checkbox" className="mr-4 cursor-pointer w-8 h-8 accent-customRed" />
                    <span className="text-xl">{item}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Pagination Controls */}
          <section className="flex justify-center gap-40 w-full text-xl">
            <button
              className="flex items-center hover:text-gray-400"
              onClick={() => paginate(-1)}
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>
            <span className="inline-block w-4 text-center">{currentPage + 1}</span>
            <button
              className="flex items-center hover:text-gray-400"
              onClick={() => paginate(1)}
            >
              Next
              <FaChevronRight className="ml-2" />
            </button>
          </section>
        </div>
      </main>
    </>
  );
}