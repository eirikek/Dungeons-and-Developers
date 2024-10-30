import axios from 'axios';
import Monster from '../graphql/model/Monsters.ts';
import Race from '../graphql/model/Race.ts';
import Class from '../graphql/model/Class.ts';

const imageBaseURL = 'https://www.dnd5eapi.co/api/images/monsters';

const urls = {
  monsters: 'https://www.dnd5eapi.co/api/monsters',
  races: 'https://www.dnd5eapi.co/api/races',
  classes: 'https://www.dnd5eapi.co/api/classes',
};

async function fetchMonsters() {
  const { data } = await axios.get(urls.monsters);
  const monsters = data.results;

  for (const monster of monsters) {
    const monsterDetails = await axios.get(`${urls.monsters}/${monster.index}`);
    const inDB = await Monster.findOne({ name: monsterDetails.data.name });

    if (!inDB && monsterDetails.data.image) {
      const imageUrl = `${imageBaseURL}/${monsterDetails.data.index}.png`;
      await new Monster({
        name: monsterDetails.data.name,
        size: monsterDetails.data.size,
        type: monsterDetails.data.type,
        alignment: monsterDetails.data.alignment,
        hit_points: monsterDetails.data.hit_points,
        image: imageUrl,
      }).save();
      console.log(`Monster saved: ${monsterDetails.data.name}`);
    } else if (!monsterDetails.data.image) {
      console.warn(`Skipping monster ${monsterDetails.data.name} - no image available`);
    }
  }
  console.log('All monsters saved to MongoDB!');
}

async function fetchRaces() {
  const { data } = await axios.get(urls.races);
  const races = data.results;

  for (const race of races) {
    const raceDetails = await axios.get(`${urls.races}/${race.index}`);
    const inDB = await Race.findOne({ index: raceDetails.data.index });

    if (!inDB) {
      await new Race({
        index: raceDetails.data.index,
        name: raceDetails.data.name,
        size: raceDetails.data.size,
        size_description: raceDetails.data.size_description,
        alignment: raceDetails.data.alignment,
        speed: raceDetails.data.speed,
      }).save();
      console.log(`Race saved: ${raceDetails.data.name}`);
    }
  }
  console.log('All races saved to MongoDB!');
}

async function fetchClasses() {
  const { data } = await axios.get(urls.classes);
  const classes = data.results;

  for (const classData of classes) {
    const classDetails = await axios.get(`${urls.classes}/${classData.index}`);
    const inDB = await Class.findOne({ index: classDetails.data.index });

    if (!inDB) {
      await new Class({
        index: classDetails.data.index,
        name: classDetails.data.name,
        hit_die: classDetails.data.hit_die,
      }).save();
      console.log(`Class saved: ${classDetails.data.name}`);
    }
  }
  console.log('All classes saved to MongoDB!');
}

async function fetchData() {
  try {
    await fetchMonsters();
    await fetchRaces();
    await fetchClasses();
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
}

export default fetchData;