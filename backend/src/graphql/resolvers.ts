import User from './../model/User.ts';
import Monster from '../model/Monsters.ts';
import fetchMonsters from '../scripts/fetchMonsters.ts';

export default {
  Query: {
    async user(_, { ID }) {
      return User.findById(ID);
    },

    async checkUsername(_, { userName }) {
      const existingUser = await User.findOne({ userName: userName });
      return !existingUser; // Return true if available, false if taken
    },

    async monsters(_, { searchTerm = '', offset = 0, limit = 8 }) {
      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } }
        : {};

      const totalMonsters = await Monster.countDocuments(query);

      const monsters = await Monster.find(query)
        .skip(offset)
        .limit(limit);

      return {
        monsters,
        totalMonsters,
      };
    },

    async monster(_, { id }) {
      return Monster.findOne({ index: id }); // Hent et spesifikt monster basert på ID
    },
  },

  Mutation: {
    async createUser(_, { userName }) {
      const user = new User({ userName });
      await user.save();
      return {
        id: user._id,
        userName: user.userName,
        class: user.class,
        race: user.race,
        abilityScores: user.abilityScores,
        equipments: user.equipments,
      };
    },

    async fetchMonsters() {
      await fetchMonsters();
      return 'Monsters fetched!';
    },
  },
};