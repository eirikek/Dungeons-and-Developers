import axios from 'axios';
import Race from '../graphql/model/Race.ts';
import Joi from 'joi';
import { raceValidationSchema } from '../utils/validationSchemas.js';
const url = { races: 'https://www.dnd5eapi.co/api/races' };

async function fetchRaces() {
  let races;
  try {
    const { data } = await axios.get(url.races);
    races = data.results;
  } catch (error) {
    console.error('Failed to fetch races', error);
    return;
  }

  const processedRaces = await Promise.all(
    races.map(async (raceItem: any) => {
      let raceDetails;
      try {
        raceDetails = await axios.get(`${url.races}/${raceItem.index}`);
      } catch (error) {
        console.error(`Failed to fetch details for race: ${raceItem.name}`);
        return null;
      }

      const inDB = await Race.findOne({ index: raceDetails.data.index });
      if (!inDB) {
        const newRace = {
          index: raceDetails.data.index,
          name: raceDetails.data.name,
          size: raceDetails.data.size,
          size_description: raceDetails.data.size_description,
          alignment: raceDetails.data.alignment,
          speed: raceDetails.data.speed,
        };

        const { error, value } = raceValidationSchema.validate(newRace);
        if (error) {
          console.error(`Validation error for race: ${raceDetails.data.name}`, error);
          return;
        }
        return value;
      }
    })
  );
  const validRaces = processedRaces.filter((raceData: any) => raceData != null);
  validRaces.sort((a: any, b: any) => a.name.localeCompare(b.name));

  for (const raceData of validRaces) {
    try {
      await new Race(raceData).save();
      console.log(`Race saved: ${raceData.name}`);
    } catch (error) {
      console.error(`Failed to save Race ${raceData.name}`, error);
    }
  }

  console.log('All races saved to MongoDB!');
}
export default fetchRaces;
