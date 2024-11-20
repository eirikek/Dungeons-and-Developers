import axios from 'axios';
import AbilityScore from '../graphql/model/AbilityScore.js';

const url = { abilities: 'https://www.dnd5eapi.co/api/ability-scores' };
async function fetchAbilityScores() {
  try {
    const { data } = await axios.get(url.abilities);
    const abilities = data.results;

    const abilityPromises = abilities.map(async (ability: any) => {
      const abilityDetails = await axios.get(`${url.abilities}/${ability.index}`);
      const inDB = await AbilityScore.exists({ index: abilityDetails.data.index });
      if (!inDB) {
        const skillNames = abilityDetails.data.skills ? abilityDetails.data.skills.map((skill: any) => skill.name) : [];

        const abilityDocument = new AbilityScore({
          index: abilityDetails.data.index,
          name: abilityDetails.data.full_name,
          skills: skillNames,
          score: 0,
        });

        await abilityDocument.save();
        console.log(`Ability score saved: ${abilityDetails.data.full_name}`);
      }
    });

    await Promise.all(abilityPromises);
    console.log('All abilities saved to MongoDB!');
  } catch (error) {
    console.error('Error fetching or saving abilities:', error);
  }
}
export default fetchAbilityScores;
