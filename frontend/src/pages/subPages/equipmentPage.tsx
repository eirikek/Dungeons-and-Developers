import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination.tsx';
import EquipmentCard from '../../components/SubPages/EquipmentCard.tsx';
import useEquipments from '../../hooks/useEquipments.ts';
import { useToast } from '../../hooks/useToast.ts';
import { Equipment } from '../../interfaces/EquipmentProps.ts';
import SearchBar from '../../components/SearchBar/SearchBar.tsx';
import useEquipmentSuggestions from '../../hooks/useEquipmentsSuggestions.ts';
import CustomButton from '../../components/CustomButton/CustomButton.tsx';
import { useMediaQuery } from 'react-responsive';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import useCharacterContext from '../../hooks/useCharacter.ts';
import { useReactiveVar } from '@apollo/client';
import { equipmentsVar } from '../../context/CharacterContext.tsx';

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
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });

  const currentEquipments = useReactiveVar(equipmentsVar);

  const { addToEquipments, removeFromEquipments, removeAllEquipments } = useCharacterContext();

  const { showToast } = useToast();

  const undoRemoveRef = useRef<Equipment | Equipment[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(sessionStorage.getItem('equipmentSearchTerm') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(
    sessionStorage.getItem('equipmentSearchTerm') || ''
  );
  const [direction, setDirection] = useState(1);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(sessionStorage.getItem('equipmentCurrentPage') || '1', 10)
  );
  const equipmentsPerPage = 20;
  const maxEquipments = 10;
  const { suggestions: equipmentSuggestions } = useEquipmentSuggestions(searchTerm);
  const [noResults, setNoResults] = useState(false);

  const {
    equipments: fetchedEquipments,
    totalEquipments: fetchedTotalEquipments,
    loading,
  } = useEquipments(debouncedSearchTerm, currentPage, equipmentsPerPage);

  const [equipments, setEquipments] = useState<Equipment[]>(fetchedEquipments);

  useEffect(() => {
    setEquipments(fetchedEquipments);

    if (!loading && debouncedSearchTerm) {
      setNoResults(fetchedTotalEquipments === 0);
    }
  }, [fetchedEquipments, fetchedTotalEquipments, debouncedSearchTerm, loading]);

  useEffect(() => {
    sessionStorage.setItem('equipmentSearchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('equipmentCurrentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const savedSearchTerm = sessionStorage.getItem('equipmentSearchTerm');
    const savedPage = sessionStorage.getItem('equipmentCurrentPage');

    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
      setDebouncedSearchTerm(savedSearchTerm);
    }
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('equipmentSearchTerm');
      sessionStorage.removeItem('equipmentCurrentPage');
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const triggerSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      setDebouncedSearchTerm(trimmedSearchTerm);
      setCurrentPage(1);
    } else {
      showToast({
        message: 'Please enter a valid search term.',
        type: 'warning',
        duration: 2000,
      });
      setNoResults(false);
    }
  };

  const undoRemoveEquipment = async () => {
    if (undoRemoveRef.current && !Array.isArray(undoRemoveRef.current)) {
      const equipment = undoRemoveRef.current;
      undoRemoveRef.current = null;
      equipmentsVar([...equipmentsVar(), equipment]);

      addToEquipments(equipment);
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

      equipmentsVar([...equipmentsVar(), ...equipmentsToRestore]);

      await Promise.all(equipmentsToRestore.map((equipment) => addToEquipments(equipment)));

      showToast({
        message: 'All equipments restored',
        type: 'success',
        duration: 3000,
      });
    }
  };

  const handleEquipmentChange = async (checked: boolean, equipment: Equipment) => {
    try {
      if (checked) {
        if (currentEquipments.length >= maxEquipments) {
          showToast({
            message: 'Cannot add any more items, inventory is full',
            type: 'warning',
            duration: 2000,
          });
          return;
        }

        addToEquipments(equipment);
        showToast({
          message: `${equipment.name} was added to your equipments`,
          type: 'success',
          duration: 3000,
        });
      } else {
        removeFromEquipments(equipment);
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
    if (currentEquipments.length === 0) return;
    undoRemoveRef.current = [...currentEquipments];

    try {
      removeAllEquipments();
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

      if (isMobileOrTablet) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <MainPageLayout>
      <main className="main xl:before:bg-equipments">
        <div className="black-overlay opacity-60" />
        <div className="wrapper py-20 min-w-[70%] flex gap-y-32 2xl:gap-0 mt-10 items-center justify-center">
          <section>
            <h1 className=" text-center header mb-10">Equipments</h1>
            <div className="flex flex-col xl:flex-row gap-10 items-center">
              <button
                onClick={handleRemoveAllEquipments}
                className="text px-1 rounded-md bg-customRed hover:bg-transparent border-2 border-customRed hover:border-customRed hover:text-customRed transition-colors duration-200"
              >
                Remove All Equipments
              </button>
              <SearchBar
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                suggestions={
                  Array.isArray(equipmentSuggestions.equipments)
                    ? equipmentSuggestions.equipments.map((e: { name: never }) => e.name)
                    : []
                }
                onSuggestionClick={(suggestion) => {
                  setSearchTerm(suggestion);
                  setDebouncedSearchTerm(suggestion);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') triggerSearch();
                }}
                placeholder="Search for equipment..."
              />
              <CustomButton text="Search" onClick={triggerSearch} />
            </div>
            {debouncedSearchTerm && (
              <div className="mt-5 flex flex-col items-center">
                <p className="text">
                  Search results for: <span className="bold">{debouncedSearchTerm}</span>
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedSearchTerm('');
                    setCurrentPage(1);
                    setNoResults(false);
                  }}
                  className="text mt-2 px-1 rounded-md bg-customRed hover:bg-transparent border-2 border-customRed hover:border-customRed hover:text-customRed transition-colors duration-200"
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
          <section className="w-full h-full">
            {noResults ? (
              <div className="flex justify-center items-center w-full h-[40vh]">
                <h2 className="text-center sub-header">No Equipments Found</h2>
              </div>
            ) : isMobileOrTablet ? (
              loading ? (
                <div className="flex justify-center items-center w-full h-[40vh]">
                  <LoadingHourglass />
                </div>
              ) : (
                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-10 p-10 w-full h-full min-h-[40vh] auto-rows-fr">
                  {equipments.map((equipment, index) => {
                    const isChecked = currentEquipments.some((userEquip) => userEquip.id === equipment.id);
                    const isDisabled = currentEquipments.length >= maxEquipments && !isChecked;

                    return (
                      <EquipmentCard
                        key={index}
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
                </div>
              )
            ) : (
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentPage}
                  className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-10 p-10 w-full h-full min-h-[40vh] auto-rows-fr"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {equipments.map((equipment, index) => {
                    const isChecked = currentEquipments.some((userEquip) => userEquip.id === equipment.id);
                    const isDisabled = currentEquipments.length >= maxEquipments && !isChecked;

                    return (
                      <EquipmentCard
                        key={index}
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
            )}
          </section>

          <div className="min-h-[10vh]">
            {fetchedTotalEquipments > equipmentsPerPage && (
              <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
            )}
            <div />
          </div>
        </div>
      </main>
    </MainPageLayout>
  );
};
export default EquipmentPage;
