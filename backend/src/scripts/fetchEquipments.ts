import axios from 'axios';
import Equipment from '../graphql/model/Equipment.js';
import Joi from 'joi';
import { equipmentValidationSchema } from '../utils/validationSchemas.js';
const url = { equipments: 'https://www.dnd5eapi.co/api/equipment' };

async function fetchEquipments() {
  let equipments;
  try {
    const { data } = await axios.get(url.equipments);
    equipments = data.results;
  } catch (error) {
    console.error('Failed to fetch equipments', error);
    return;
  }

  const processedEquipments = await Promise.all(
    equipments.map(async (equipment: any) => {
      let equipmentDetails;
      try {
        equipmentDetails = await axios.get(`${url.equipments}/${equipment.index}`);
      } catch (error) {
        console.error(`Failed to fetch details for equipment: ${equipment.name}`);
        return null;
      }
      const inDB = await Equipment.exists({ index: equipmentDetails.data.index });

      if (!inDB) {
        const newEquipment = {
          index: equipmentDetails.data.index,
          name: equipmentDetails.data.name,
          category: equipmentDetails.data.equipment_category.name,
          value: equipmentDetails.data.cost.quantity,
        };
        const { error, value } = equipmentValidationSchema.validate(newEquipment);
        if (error) {
          console.error(`Validation error for equipment: ${equipmentDetails.data.name}`, error);
          return;
        }
        return value;
      }
    })
  );
  const validEquipments = processedEquipments.filter((equipment) => equipment != null);
  validEquipments.sort((a: any, b: any) => a.name.localeCompare(b.name));

  for (const equipmentData of validEquipments) {
    try {
      await new Equipment(equipmentData).save();
      console.log(`Equipment saved: ${equipmentData.name}`);
    } catch (error) {
      console.error(`Failed to save equipment ${equipmentData.name}`, error);
    }
  }
  console.log('All equipments saved to MongoDB!');
}
export default fetchEquipments;
