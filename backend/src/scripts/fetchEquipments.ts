import axios from 'axios';
import Equipment from '../graphql/model/Equipment.js';
const url = { equipments: 'https://www.dnd5eapi.co/api/equipment' };

async function fetchEquipments() {
  const { data } = await axios.get(url.equipments);
  const equipments = data.results;

  for (const equipment of equipments) {
    const equipmentDetails = await axios.get(`${url.equipments}/${equipment.index}`);
    const inDB = await Equipment.exists({ index: equipmentDetails.data.index });

    if (!inDB) {
      await new Equipment({
        index: equipmentDetails.data.index,
        name: equipmentDetails.data.name,
        category: equipmentDetails.data.equipment_category.name,
        value: equipmentDetails.data.cost.quantity,
      }).save();
      console.log(`Equipment saved: ${equipmentDetails.data.name}`);
    }
  }
  console.log('All equipments saved to MongoDB!');
}
export default fetchEquipments;
