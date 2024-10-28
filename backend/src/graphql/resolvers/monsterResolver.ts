import Monster from '../model/Monsters.ts';
import fetchData from '../../scripts/fetchData.js';

interface MonsterArgs {
  id: string;
}

interface MonsterQueryArgs {
  searchTerm?: string;
  offset?: number;
  limit?: number;
}

interface ReviewInput {
  user: string;
  difficulty: number;
  description: string;
}

export default {
  Query: {
    async monsters(_: any, { searchTerm = '', offset = 0, limit = 8 }: MonsterQueryArgs) {
      let monsters = [];
      let totalMonsters = 0;

      if (searchTerm) {
        // Create a regex to match names that start with the search term
        const startsWithRegex = new RegExp(`^${searchTerm}`, 'i');

        // First, find monsters that start with the search term
        const startsWithResults = await Monster.find({ name: { $regex: startsWithRegex } })
          .skip(offset)
          .limit(limit);

        // If not get enough results, add additional ones that contain the search term anywhere
        if (startsWithResults.length < limit) {
          const containsRegex = new RegExp(searchTerm, 'i');
          const additionalResults = await Monster.find({ name: { $regex: containsRegex } })
            .skip(offset)
            .limit(limit - startsWithResults.length);

          monsters = [...startsWithResults, ...additionalResults];
        } else {
          monsters = startsWithResults;
        }

        // Calculate the total number of monsters that contain the search term
        totalMonsters = await Monster.countDocuments({ name: { $regex: new RegExp(searchTerm, 'i') } });
      } else {
        // If no search term, get all monsters with pagination
        monsters = await Monster.find().skip(offset).limit(limit);
        totalMonsters = await Monster.countDocuments();
      }

      return { monsters, totalMonsters };
    },

    async monster(_: any, { id }: MonsterArgs) {
      return Monster.findOne({ index: id });
    },
  },

  Mutation: {
    async fetchAllData() {
      await fetchData();
      return 'Data fetched and stored successfully!';
    },

    async addReview(_: any, { monsterId, review }: { monsterId: string; review: ReviewInput }) {
      const monster = await Monster.findById(monsterId);
      if (!monster) throw new Error('Monster not found');

      monster.reviews.push(review);
      await monster.save();

      return monster;
    },
  },
};