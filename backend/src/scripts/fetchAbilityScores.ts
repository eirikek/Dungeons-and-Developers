import axios from 'axios';
import mongoose from 'mongoose';
import AbilityScore from '../model/AbilityScore.js';

const abilitiesURL = 'https://www.dnd5eapi.co/api/ability-scores';
const mongoUri = 'mongodb://admin:adminpassordetditt@it2810-20.idi.ntnu.no:27017/Profile?directConnection=true&authSource=admin&appName=mongosh+2.3.2';




async function fetchAbilityScores() {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    const { data } = await axios.get(abilitiesURL);
    const abilities = data.results;


    for (const ability of abilities) {
      const abilityDetails = await axios.get(`${abilitiesURL}/${ability.index}`);

      const inDB = await AbilityScore.findOne({index: abilityDetails.data.index})

      if(!inDB) {

        const abilityDocument = new AbilityScore({
          index: abilityDetails.data.index,
          name: abilityDetails.data.name,
          desc: abilityDetails.data.desc

        });

        await abilityDocument.save();
        console.log(`race saved: ${abilityDetails.data.name}`);
      }

    }

    console.log('All race saved to MongoDB!');
  } catch (error) {
    console.error('Error fetching or saving race:', error);
  }
}

fetchAbilityScores().then(() => console.log('Race is fetched'));

export default fetchAbilityScores;