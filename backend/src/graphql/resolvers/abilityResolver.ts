import AbilityScore from '../model/AbilityScore.js';
import fetchData from '../../scripts/fetchData.ts';

export default {
  Query: {
    async abilities(_: any, offset = 0, limit = 1) {
      const totalAbilities = await AbilityScore.countDocuments();
      const abilities = await AbilityScore.find().skip(offset).limit(limit);

      const abilitiesWithId = abilities.map((ability) => ({
        ...ability.toObject(),
        id: ability._id.toString(),
      }));

      console.log('Fetched abilities:', abilitiesWithId);
      console.log('Total abilities count:', totalAbilities);

      return { abilities: abilitiesWithId, totalAbilities };
    },

    async ability(_: any, { id }: any) {
      const ability = await AbilityScore.findOne({ index: id });

      if (!ability) {
        throw new Error(`Ability not found for index: ${id}`);
      }

      return {
        ...ability.toObject(),
        id: ability._id.toString(),
      };
    },
  },

  Mutation: {
    async fetchAllData() {
      await fetchData();
      return 'Data fetched and stored successfully!';
    },
  },
};
