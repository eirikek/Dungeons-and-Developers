import { useMutation, useQuery } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import {
  ADD_EQUIPMENT_TO_CHARACTER,
  GET_USER_EQUIPMENT,
  REMOVE_EQUIPMENT_FROM_CHARACTER,
} from '../../../../backend/src/graphql/queries.ts';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination.tsx';
import EquipmentCard from '../../components/SubPages/EquipmentCard.tsx';
import { AuthContext } from '../../context/AuthContext.tsx';
import useEquipments from '../../hooks/useEquipments.ts';
import { useToast } from '../../hooks/useToast.ts';
import { Equipment } from '../../interfaces/EquipmentProps.ts';

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
  const [direction, setDirection] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const equipmentsPerPage = 20;
  const maxEquipments = 10;

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [totalEquipments, setTotalEquipments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userEquipments, setUserEquipments] = useState<Equipment[]>([]);

  const { equipments: fetchedEquipments, totalEquipments: fetchedTotalEquipments } = useEquipments(
    currentPage,
    equipmentsPerPage
  );
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    refetch: refetchUserEquipments,
  } = useQuery(GET_USER_EQUIPMENT, {
    variables: { userId },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setEquipments(fetchedEquipments);
        setTotalEquipments(fetchedTotalEquipments);
        console.log('Set userEquipments:');
      } catch (error) {
        console.log('Error fetching equipments', error);
      }
    };

    fetchEquipments();
  }, [currentPage, fetchedEquipments, fetchedTotalEquipments]);

  useEffect(() => {
    const fetchUserEquipments = () => {
      if (userData?.user) {
        const fetchedEquipments = userData.user.equipments || [];
        setUserEquipments(fetchedEquipments);
        console.log('Set userEquipments:', fetchedEquipments);
      } else {
        console.log('User equipments is null!');
        setUserEquipments([]);
      }
      setLoading(false);
    };

    if (userData) {
      fetchUserEquipments();
    }
  }, [userData]);

  const [addEquipment] = useMutation(ADD_EQUIPMENT_TO_CHARACTER, {
    onCompleted: () => {
      refetchUserEquipments().then((r) => console.log('Fetched equipments ', r));
    },
  });

  const [removeEquipment] = useMutation(REMOVE_EQUIPMENT_FROM_CHARACTER, {
    onCompleted: () => {
      refetchUserEquipments().then((r) => console.log('Fetched equipments ', r));
    },
  });

  useEffect(() => {
    if (userData?.user?.equipments) {
      setUserEquipments(userData.user.equipments);
    }
  }, [userData]);

  const handleEquipmentChange = async (equipId: string, checked: boolean, equipment: Equipment) => {
    try {
      if (checked) {
        // Check if user already has the maximum number of equipments
        if (userEquipments.length >= maxEquipments) {
          showToast({
            message: 'Cannot add any more items, inventory is full',
            type: 'warning',
            duration: 2000,
          });
          return; // Early return to prevent adding the equipment
        }

        // Proceed to add equipment if within limits
        await addEquipment({ variables: { userId, equipmentId: equipId } });
        showToast({
          message: `${equipment.name} was added to your equipments!`,
          type: 'success',
          duration: 3000,
        });
        setUserEquipments((prev) => [...prev, equipment]);
      } else {
        // Handle equipment removal
        await removeEquipment({ variables: { userId, equipmentId: equipId } });
        showToast({
          message: `${equipment.name} was removed from your equipments!`,
          type: 'success',
          duration: 3000,
        });
        setUserEquipments((prev) => prev.filter((userEquip) => userEquip.id !== equipId));
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  const totalPages = Math.ceil(totalEquipments / equipmentsPerPage);
  const handlePageChange = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setDirection(newDirection);
    }
  };

  if (loading || userLoading) return <div>Loading...</div>;
  if (error || userError) return <div>Error loading equipments.</div>;

  return (
    <MainPageLayout>
      <main className="main before:bg-equipments">
        <div className="black-overlay" />
        <div className="wrapper py-20 min-w-[70%] flex gap-y-32 2xl:gap-0 mt-10 items-center justify-center">
          <h1 className="header">Equipments</h1>
          <section className="w-full h-9/10 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-6 p-4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {equipments.map((equipment, index) => {
                  return (
                    <EquipmentCard
                      key={index}
                      equipment={equipment}
                      isChecked={userEquipments.some((userEquip) => userEquip.id === equipment.id)}
                      userId={userId}
                      onChange={handleEquipmentChange}
                      disabled={userEquipments.length >= maxEquipments}
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
