import User from './../model/User.ts';
import Monster from '../model/Monsters.ts';
import fetchMonsters from '../scripts/fetchMonsters.ts';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

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
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        throw new Error('Username is already taken');
      }

      const user = new User({ userName });
      await user.save();

      const token = jwt.sign({ id: user._id, userName: user.userName }, SECRET_KEY, { expiresIn: '2h' });

      return {
        user: {
          id: user._id,
          userName: user.userName,
          class: user.class,
          race: user.race,
          abilityScores: user.abilityScores,
          equipments: user.equipments,
        },
        token,
      };
    },

    async loginUser(_, { userName }) {
      const user = await User.findOne({ userName });
      if (!user) {
        throw new Error('User not found');
      }

      const token = jwt.sign({ id: user._id, userName: user.userName }, SECRET_KEY, { expiresIn: '2h' });

      return {
        user: {
          id: user._id,
          userName: user.userName,
          class: user.class,
          race: user.race,
          abilityScores: user.abilityScores,
          equipments: user.equipments,
        },
        token,
      };
    },

    async fetchMonsters() {
      await fetchMonsters();
      return 'Monsters fetched!';
    },
  },
};