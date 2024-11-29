import axios from 'axios';
import sharp from 'sharp';
import Monster from '../graphql/model/Monsters.ts';

const url = { monsters: 'https://www.dnd5eapi.co/api/monsters' };

async function fetchMonsters() {
  const { data } = await axios.get(url.monsters);
  const monsters = data.results;

  for (const monster of monsters) {
    const monsterDetails = await axios.get(`${url.monsters}/${monster.index}`);
    const inDB = await Monster.findOne({ name: monsterDetails.data.name });

    if (!inDB && monsterDetails.data.image) {
      try {
        const imageUrl = `https://www.dnd5eapi.co${monsterDetails.data.image}`;
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        const webpImage = await sharp(imageResponse.data).webp({ quality: 80 }).toBuffer();

        await new Monster({
          name: monsterDetails.data.name,
          size: monsterDetails.data.size,
          type: monsterDetails.data.type,
          alignment: monsterDetails.data.alignment,
          hit_points: monsterDetails.data.hit_points,
          image: webpImage,
        }).save();

        console.log(`Monster saved: ${monsterDetails.data.name}`);
      } catch (error) {
        console.error(`Failed to process image for ${monsterDetails.data.name}:`, error);
      }
    } else if (!monsterDetails.data.image) {
      console.warn(`Skipping monster ${monsterDetails.data.name} - no image available`);
    }
  }
  console.log('All monsters saved to MongoDB!');
}

export default fetchMonsters;
