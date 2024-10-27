import axios from 'axios';
import mongoose from 'mongoose';
import Race from '../graphql/model/Race.js';

const racesURL = 'https://www.dnd5eapi.co/api/races';
const mongoUri = 'mongodb://admin:adminpassordetditt@it2810-20.idi.ntnu.no:27017/Profile?directConnection=true&authSource=admin&appName=mongosh+2.3.2';


async function fetchRaces() {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    const { data } = await axios.get(racesURL);
    const races = data.results;
    //console.log(races, "these are races")

    for (const race of races) {
      const raceDetails = await axios.get(`${racesURL}/${race.index}`);
      //console.log(raceDetails, "this is the race details")
      //const raceImage = imageMapping[race.index];
      //console.log(raceImage, "RaceImage");

      //if (raceDetails.data.image) {
      const inDB = await Race.findOne({ index: raceDetails.data.index });
      //const imageUrl =  raceImage || undefined;
      if (!inDB) {

        const raceDocument = new Race({
          index: raceDetails.data.index,
          name: raceDetails.data.name,
          size: raceDetails.data.size,
          size_description: raceDetails.data.size_description,
          alignment: raceDetails.data.alignment,
          speed: raceDetails.data.speed,
          //image: imageUrl,
        });

        await raceDocument.save();
        console.log(`race saved: ${raceDetails.data.name}`);
      }
      //}
    }

    console.log('All race saved to MongoDB!');
  } catch (error) {
    console.error('Error fetching or saving race:', error);
  }
}

fetchRaces().then(() => console.log('Race is fetched'));

export default fetchRaces;