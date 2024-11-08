import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination.tsx';
import EquipmentCard from '../../components/SubPages/EquipmentCard.tsx';
import { AuthContext } from '../../context/AuthContext.tsx';
import useEquipments from '../../hooks/useEquipments.ts';
import { useToast } from '../../hooks/useToast.ts';
import { Equipment } from '../../interfaces/EquipmentProps.ts';
import useUserEquipments from '../../hooks/useUserEquipments.ts';
import { REMOVE_ALL_EQUIPMENTS } from '../../../../backend/src/graphql/queries.ts';
import { useMutation } from '@apollo/client';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const EquipmentPage = () => {
  const { userId } = useContext(AuthContext);
  const { showToast } = useToast();
  const { userEquipments, loading, addToEquipments, removeFromEquipments } = useUserEquipments();
  const undoRemoveRef = useRef<Equipment | Equipment[] | null>(null);
  const [removeAllEquipments] = useMutation(REMOVE_ALL_EQUIPMENTS);

  const [direction, setDirection] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const equipmentsPerPage = 20;
  const maxEquipments = 10;

  const { equipments: fetchedEquipments, totalEquipments: fetchedTotalEquipments } = useEquipments(
    currentPage,
    equipmentsPerPage
  );

  const [equipments, setEquipments] = useState<Equipment[]>(fetchedEquipments);

  useEffect(() => {
    setEquipments(fetchedEquipments);
  }, [currentPage, fetchedEquipments]);

  const undoRemoveEquipment = async () => {
    if (undoRemoveRef.current && !Array.isArray(undoRemoveRef.current)) {
      const equipment = undoRemoveRef.current;
      undoRemoveRef.current = null;

      await addToEquipments(equipment.id);
      showToast({
        message: `${equipment.name} restored to equipments`,
        type: 'success',
        duration: 3000,
      });
    }
  };

  const undoRemoveAllEquipments = async () => {
    if (undoRemoveRef.current && Array.isArray(undoRemoveRef.current)) {
      const equipmentsToRestore = undoRemoveRef.current;
      undoRemoveRef.current = null;

      await Promise.all(equipmentsToRestore.map((equipment) => addToEquipments(equipment.id)));

      showToast({
        message: 'All equipments restored',
        type: 'success',
        duration: 3000,
      });
    }
  };

  const handleEquipmentChange = async (equipId: string, checked: boolean, equipment: Equipment) => {
    try {
      if (checked) {
        if (userEquipments.length >= maxEquipments) {
          showToast({
            message: 'Cannot add any more items, inventory is full',
            type: 'warning',
            duration: 2000,
          });
          return;
        }

        await addToEquipments(equipId);
        showToast({
          message: `${equipment.name} was added to your equipments`,
          type: 'success',
          duration: 3000,
        });
      } else {
        await removeFromEquipments(equipId);
        undoRemoveRef.current = equipment;
        showToast({
          message: `${equipment.name} removed from equipments`,
          type: 'info',
          duration: 5000,
          undoAction: undoRemoveEquipment,
        });
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  const handleRemoveAllEquipments = async () => {
    if (!userId || userEquipments.length === 0) return;
    undoRemoveRef.current = [...userEquipments];

    try {
      await removeAllEquipments({ variables: { userId } });
      showToast({
        message: 'All equipments removed',
        type: 'info',
        duration: 5000,
        undoAction: undoRemoveAllEquipments,
      });
    } catch (error) {
      console.error('Error removing all equipments:', error);
      showToast({
        message: 'Failed to remove all equipments',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const totalPages = Math.ceil(fetchedTotalEquipments / equipmentsPerPage);
  const handlePageChange = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setDirection(newDirection);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <MainPageLayout>
      <main className="main before:bg-equipments">
        <div className="black-overlay" />
        <div className="wrapper py-20 min-w-[70%] flex gap-y-32 2xl:gap-0 mt-10 items-center justify-center">
          <h1 className="header">Equipments</h1>
          <button
            onClick={handleRemoveAllEquipments}
            className="text px-1 rounded-md bg-customRed hover:bg-transparent border-2 border-customRed hover:border-customRed hover:text-customRed transition-colors duration-200"
          >
            Remove All Equipments
          </button>
          <section className="w-full h-9/10">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-10 p-10 w-full h-full auto-rows-fr"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {equipments.map((equipment, index) => {
                  const isChecked = userEquipments.some((userEquip) => userEquip.id === equipment.id);
                  const isDisabled = userEquipments.length >= maxEquipments && !isChecked;

                  return (
                    <EquipmentCard
                      aria-label="equipment-card"
                      key={index}
                      userId={userId}
                      equipment={equipment}
                      isChecked={isChecked}
                      onChange={handleEquipmentChange}
                      disabled={isDisabled}
                      onDisabledClick={() => {
                        showToast({
                          message: 'Cannot add any more items, inventory is full',
                          type: 'warning',
                          duration: 2000,
                        });
                      }}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </section>
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
        </div>
      </main>
    </MainPageLayout>
  );
};
export default EquipmentPage;
