import axios from 'axios';
import mongoose from 'mongoose';
import Monster from '../model/Monsters.ts';

const defaultURL = 'https://www.dnd5eapi.co';
const monstersURL = 'https://www.dnd5eapi.co/api/monsters';
const mongoUri = 'mongodb://admin:adminpassordetditt@it2810-20.idi.ntnu.no:27017/Profile?directConnection=true&authSource=admin&appName=mongosh+2.3.2';

// Funksjon for å hente monstre fra API og lagre dem i MongoDB
async function fetchMonsters() {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    const { data } = await axios.get(monstersURL);
    const monsters = data.results;

    for (const monster of monsters) {
      const monsterDetails = await axios.get(`${monstersURL}/${monster.index}`);

      const imageUrl = monsterDetails.data.image ? `${defaultURL}${monsterDetails.data.image}` : undefined;

      const monsterDocument = new Monster({
        index: monsterDetails.data.index,
        name: monsterDetails.data.name,
        size: monsterDetails.data.size,
        type: monsterDetails.data.type,
        alignment: monsterDetails.data.alignment,
        hit_points: monsterDetails.data.hit_points,
        image: imageUrl,
      });

      await monsterDocument.save();
      console.log(`Monster saved: ${monsterDetails.data.name}`);
    }

    console.log('All monsters saved to MongoDB!');
  } catch (error) {
    console.error('Error fetching or saving monsters:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fetchMonsters().then(() => console.log('Monsters fetched'));

export default fetchMonsters;