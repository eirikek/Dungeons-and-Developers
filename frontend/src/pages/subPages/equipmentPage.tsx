import { useContext, useState } from 'react';
import { Equipment } from 'src/interfaces/EquipmentProps.ts';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination.tsx';
import EquipmentCard from '../../components/SubPages/EquipmentCard.tsx';
import { CharacterContext } from '../../context/CharacterContext';
import useEquipments from '../../hooks/useEquipments';

const EquipmentPage = () => {
  const characterContext = useContext(CharacterContext);
  const [currentPage, setCurrentPage] = useState(1);
  const equipmentsPerPage = 20;

  if (!characterContext) {
    throw new Error('CharacterContext must be used within a CharacterProvider');
  }

  const { userEquipments, addEquipment, removeEquipment, removeAllEquipments, loading, error } = characterContext;

  const { equipments, totalEquipments } = useEquipments(currentPage, equipmentsPerPage);
  const totalPages = Math.ceil(totalEquipments / equipmentsPerPage);

  const handleEquipmentChange = async (checked: boolean, equipment: Equipment) => {
    if (checked) {
      await addEquipment(equipment.id);
    } else {
      await removeEquipment(equipment.id);
    }
  };

  const handleRemoveAll = async () => {
    await removeAllEquipments();
  };

  const handlePageChange = (direction: number) => {
    setCurrentPage((prevPage) => Math.min(Math.max(prevPage + direction, 1), totalPages));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading equipments.</div>;

  return (
    <MainPageLayout>
      <main className="main before:bg-equipments">
        <div className="black-overlay" />
        <div className="wrapper py-20 flex flex-col items-center">
          <h1 className="header">Equipments</h1>
          <button onClick={handleRemoveAll} className="btn-danger">
            Remove All Equipments
          </button>
          <section className="grid grid-cols-4 gap-5">
            {equipments.map((equipment) => {
              const isChecked = userEquipments.some((item) => item.id === equipment.id);
              return (
                <EquipmentCard
                  key={equipment.id}
                  equipment={equipment}
                  isChecked={isChecked}
                  onChange={handleEquipmentChange}
                  disabled={!isChecked && userEquipments.length >= 10}
                  onDisabledClick={() => alert('Cannot add more items, inventory is full.')}
                />
              );
            })}
          </section>
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
        </div>
      </main>
    </MainPageLayout>
  );
};

export default EquipmentPage;
