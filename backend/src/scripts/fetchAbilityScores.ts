import axios from 'axios';
import AbilityScore from '../graphql/model/AbilityScore.js';
import Joi from 'joi';
import { abilityScoreValidationSchema } from '../utils/validationSchemas.js';
const url = { abilities: 'https://www.dnd5eapi.co/api/ability-scores' };

async function fetchAbilityScores() {
  let abilities;
  try {
    const { data } = await axios.get(url.abilities);
    abilities = data.results;
  } catch (error) {
    console.error('Failed to fetch abilities', error);
    return;
  }
  const processedAbilities = await Promise.all(
    abilities.map(async (ability: any) => {
      let abilityDetails;
      try {
        abilityDetails = await axios.get(`${url.abilities}/${ability.index}`);
      } catch (error) {
        console.error(`Failed to fetch details for ability: ${ability.name}`);
        return null;
      }
      const inDB = await AbilityScore.exists({ index: abilityDetails.data.index });

      if (!inDB) {
        const skillNames = abilityDetails.data.skills ? abilityDetails.data.skills.map((skill: any) => skill.name) : [];

        const newAbility = {
          index: abilityDetails.data.index,
          name: abilityDetails.data.full_name,
          skills: skillNames,
          score: 0,
        };

        const { error, value } = abilityScoreValidationSchema.validate(newAbility);
        if (error) {
          console.error(`Validation error for ability: ${abilityDetails.data.full_name}`, error);
          return;
        }
        return value;
      }
    })
  );
  const validAbilities = processedAbilities.filter((ability) => ability != null);
  validAbilities.sort((a: any, b: any) => a.name.localeCompare(b.name));

  for (const abilityData of validAbilities) {
    try {
      await new AbilityScore(abilityData).save();
      console.log(`Ability saved: ${abilityData.name}`);
    } catch (error) {
      console.error(`Failed to save ability ${abilityData.name}`, error);
    }
  }
}
export default fetchAbilityScores;
