import Monster from '../model/Monsters.ts';
import fetchMonsters from '../../scripts/fetchMonsters.ts';

interface MonsterArgs {
  id: string;
}

interface MonsterQueryArgs {
  searchTerm?: string;
  offset?: number;
  limit?: number;
}

export default {
  Query: {
    async monsters(_: any, { searchTerm = '', offset = 0, limit = 8 }: MonsterQueryArgs) {
      const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};
      const totalMonsters = await Monster.countDocuments(query);
      const monsters = await Monster.find(query).skip(offset).limit(limit);

      return { monsters, totalMonsters };
    },

    async monster(_: any, { id }: MonsterArgs) {
      return Monster.findOne({ index: id });
    },
  },

  Mutation: {
    async fetchMonsters() {
      await fetchMonsters();
      return 'Monsters fetched!';
    },
  },
};