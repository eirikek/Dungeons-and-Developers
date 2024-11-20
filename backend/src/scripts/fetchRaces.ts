import axios from 'axios';
import Race from '../graphql/model/Race.ts';

const url = { races: 'https://www.dnd5eapi.co/api/races' };

async function fetchRaces() {
  const { data } = await axios.get(url.races);
  const races = data.results;

  for (const race of races) {
    const raceDetails = await axios.get(`${url.races}/${race.index}`);
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
export default fetchRaces;
