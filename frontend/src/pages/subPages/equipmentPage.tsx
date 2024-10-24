import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEquipments from '../../hooks/useEquipments.ts';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination.tsx';
import CustomCheckbox from '../../components/CustomCheckbox/CustomCheckbox.tsx';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(1); // +1 for next, -1 for previous

  const handlePageChange = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setDirection(newDirection);
    }
  };

  const currentEquipment = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );


  return (
    <MainPageLayout>
      <main
        className="main before:bg-equipments">
        <div className="black-overlay" />
        <div
          className="wrapper py-20 min-w-[70%] flex gap-y-32 2xl:gap-0 mt-10 items-center justify-center">
          <h1 className="header">Equipments</h1>

          {/* Equipment Grid */}
          <section className="w-full h-9/10 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-20 gap-y-16 w-full"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {currentEquipment.map((equip, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <CustomCheckbox scale={1} />
                    <span className="text">{equip.name}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      </main>
    </MainPageLayout>
  );
};
export default EquipmentPage;