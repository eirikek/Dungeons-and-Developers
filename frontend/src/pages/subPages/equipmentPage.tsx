import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination.tsx';
import { useToast } from '../../context/useToast.ts';
import useEquipments from '../../hooks/useEquipments.ts';

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
  const { showToast } = useToast();

  const results = useEquipments();

  const itemsPerPage = 20;
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(1); // +1 for next, -1 for previous
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handlePageChange = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setDirection(newDirection);
    }
  };

  const currentEquipment = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (checkedItems.length === 10) {
      showToast({
        message: 'Cannot add more items, you inventory is full!',
        type: 'warning',
      });
    }
  }, [checkedItems.length, showToast]);

  const handleClick = (name: string) => {
    if (checkedItems.includes(name)) {
      setCheckedItems(checkedItems.filter((item) => item !== name));
      showToast({
        message: `${name} was removed from your inventory`,
        type: 'info',
        duration: 1000,
      });
    } else {
      setCheckedItems([...checkedItems, name]);
      showToast({
        message: `${name} was added to your inventory`,
        type: 'info',
        duration: 1000,
      });
    }
  };

  return (
    <MainPageLayout>
      <main className="relative flex flex-col items-center justify-center min-h-screen w-full z-0 before:absolute before:inset-0 before:bg-equipments before:bg-cover before:bg-center before:z-0">
        <div className="absolute inset-0 w-full h-full bg-black opacity-70" />
        <div className="flex flex-col py-20 text-white min-h-[calc(100vh-100px)] min-w-[70%] z-10 mt-24 justify-between items-center">
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
                    <input
                      type="checkbox"
                      className="mr-4 cursor-pointer min-w-8 min-h-8 accent-customRed"
                      onClick={() => handleClick(equip.name)}
                      checked={checkedItems.includes(equip.name)}
                      disabled={checkedItems.length >= 10 && !checkedItems.includes(equip.name)}
                    />
                    <span className="text-xl">{equip.name}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Pagination Controls */}
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
        </div>
      </main>
    </MainPageLayout>
  );
};
export default EquipmentPage;
