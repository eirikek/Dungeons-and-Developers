import axios from 'axios';
import pLimit from 'p-limit';
import sharp from 'sharp';
import Monsters from '../graphql/model/Monsters.ts';
import { monsterValidationSchema } from '../utils/validationSchemas.ts';

const url = { monsters: 'https://www.dnd5eapi.co/api/monsters' };
const githubImageUrl = 'https://raw.githubusercontent.com/seball/5e-encounter/master/src/assets/monsters';

async function fetchMonsters() {
  let monsters;
  try {
    const { data } = await axios.get(url.monsters);
    monsters = data.results;
  } catch (error) {
    console.error('Failed to fetch monsters', error);
    return;
  }

  const limit = pLimit(5);

  const monsterPromises = monsters.map((monster: { index: any; name: any }) =>
    limit(async () => {
      let monsterDetails;
      try {
        monsterDetails = await axios.get(`${url.monsters}/${monster.index}`);
      } catch (error) {
        console.error(`Failed to fetch details for monster ${monster.name}:`, error);
        return;
      }

      const inDB = await Monsters.findOne({ name: monsterDetails.data.name });

      if (!inDB) {
        let base64Image = null;
        try {
          const imageUrl = `${githubImageUrl}/${monsterDetails.data.index.toLowerCase().replace(/ /g, '_')}.webp`;

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

        try {
          await new Monsters(value).save();
          console.log(`Monster saved: ${value.name}`);
        } catch (error) {
          console.error(`Failed to save monster ${value.name}:`, error);
        }
      } else {
        console.warn(`Monster ${monsterDetails.data.name} already exists in the database.`);
      }
    })
  );

  await Promise.all(monsterPromises);

  console.log('All monsters processed!');
}

export default fetchMonsters;
