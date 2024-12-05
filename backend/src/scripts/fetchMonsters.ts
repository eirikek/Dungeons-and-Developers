import axios from 'axios';
import sharp from 'sharp';
import Monster from '../graphql/model/Monsters.ts';
import { monsterValidationSchema } from '../utils/validationSchemas.js';
const url = { monsters: 'https://www.dnd5eapi.co/api/monsters' };

/**
 * Fetches monsters with name, size, hp, type and alignment information
 * Makes monster images to base64 using Sharp to reduce file size and loading time
 */
async function fetchMonsters() {
  let monsters;
  try {
    const { data } = await axios.get(url.monsters);
    monsters = data.results;
  } catch (error) {
    console.error('Failed to fetch monsters', error);
    return;
  }

  const processedMonsters = await Promise.all(
    monsters.map(async (monster: any) => {
      let monsterDetails;
      try {
        monsterDetails = await axios.get(`${url.monsters}/${monster.index}`);
      } catch (error) {
        console.error(`Failed to fetch details for monster ${monster.name}:`, error);
        return null;
      }

      const inDB = await Monster.findOne({ name: monsterDetails.data.name });

      if (!inDB && monsterDetails.data.image) {
        let base64Image = null;
        try {
          const imageUrl = `https://www.dnd5eapi.co${monsterDetails.data.image}`;
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

          const webpImage = await sharp(imageResponse.data).webp({ quality: 80 }).toBuffer();
          base64Image = webpImage.toString('base64');
        } catch (error) {
          console.error(`Failed to process image for ${monsterDetails.data.name}:`, error);
          base64Image = null;
        }
        const newMonster = {
          name: monsterDetails.data.name,
          size: monsterDetails.data.size,
          type: monsterDetails.data.type,
          alignment: monsterDetails.data.alignment,
          hit_points: monsterDetails.data.hit_points,
          image: base64Image || null,
        };

        const { error, value } = monsterValidationSchema.validate(newMonster);
        if (error) {
          console.error(`Validation error for monster ${monsterDetails.data.name}:`, error.details);
          return;
        }
        return value;
      } else if (!monsterDetails.data.image) {
        console.warn(`Skipping monster ${monsterDetails.data.name} - no image available`);
      }
    })
  );

  const validMonsters = processedMonsters.filter((monster) => monster != null);
  validMonsters.sort((a: any, b: any) => a.name.localeCompare(b.name));

  for (const monsterData of validMonsters) {
    try {
      await new Monster(monsterData).save();
      console.log(`Monster saved: ${monsterData.name}`);
    } catch (error) {
      console.error(`Failed to save monster ${monsterData.name}:`, error);
    }
  }
  console.log('All monsters saved to MongoDB!');
}

export default fetchMonsters;
