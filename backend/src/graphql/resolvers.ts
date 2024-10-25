import User from './../model/User.ts';
import Monster from '../model/Monsters.ts';
import fetchMonsters from '../scripts/fetchMonsters.ts';
import jwt from 'jsonwebtoken';
import Race from '../model/Race.ts';
import fetchRaces from '../scripts/fetchRaces.ts';
import Class from '../model/Class.js';
import fetchClasses from '../scripts/fetchClasses.js';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

// Define the TypeScript types for arguments
interface UserArgs {
  userName: string;
}

interface MonsterArgs {
  id: string;
}

interface RaceArgs {
  id: string;
}

interface ClassArgs {
  id: string;
}

interface PaginationArgs {
  offset: number;
  limit: number;
}

interface MonsterQueryArgs extends PaginationArgs {
  searchTerm: string;
}

export default {
  Query: {
    async user(_: any, { ID }: { ID: string }) {
      return User.findById(ID).populate('race').populate('class');
    },

    async checkUsername(_: any, { userName }: UserArgs) {
      const existingUser = await User.findOne({ userName });
      return !existingUser; // Return true if available, false if taken
    },

    async races(_: any, { offset = 0, limit = 1 }: PaginationArgs) {
      const totalRaces = await Race.countDocuments();
      const races = await Race.find().skip(offset).limit(limit);
      return { races, totalRaces };
    },

    async classes(_: any, { offset = 0, limit = 1 }: PaginationArgs) {
      const totalClasses = await Class.countDocuments();
      const classes = await Class.find().skip(offset).limit(limit);
      return { classes, totalClasses };
    },

    async monsters(_: any, { searchTerm = '', offset = 0, limit = 8 }: MonsterQueryArgs) {
      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } }
        : {};

      const totalMonsters = await Monster.countDocuments(query);
      const monsters = await Monster.find(query).skip(offset).limit(limit);

      return {
        monsters,
        totalMonsters,
      };
    },

    async monster(_: any, { id }: MonsterArgs) {
      return Monster.findOne({ index: id });
    },

    async race(_: any, { id }: RaceArgs) {
      return Race.findOne({ index: id });
    },

    async class(_: any, { id }: ClassArgs) {
      return Class.findOne({ index: id });
    },
  },

  Mutation: {
    async createUser(_: any, { userName }: UserArgs) {
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        throw new Error('Username is already taken');
      }

      const defaultRace = await Race.findOne({ index: 'human' });
      const defaultClass = await Class.findOne({ index: 'barbarian' });

      if (!defaultRace || !defaultClass) {
        throw new Error('Default race or class not found in the database');
      }

      const user = new User({
        userName,
        race: defaultRace._id,
        class: defaultClass._id,
      });

      await user.save();

      const token = jwt.sign({ id: user._id, userName: user.userName }, SECRET_KEY, { expiresIn: '2h' });

      return {
        user: {
          id: user._id,
          userName: user.userName,
          race: defaultRace,
          class: defaultClass,
          abilityScores: user.abilityScores,
          equipments: user.equipments,
        },
        token,
      };
    },

    async loginUser(_: any, { userName }: UserArgs) {
      const user = await User.findOne({ userName }).populate('race').populate('class');
      if (!user) {
        throw new Error('User not found');
      }

      const token = jwt.sign({ id: user._id, userName: user.userName }, SECRET_KEY, { expiresIn: '2h' });

      return {
        user: {
          id: user._id,
          userName: user.userName,
          race: user.race,
          class: user.class,
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

    async fetchRaces() {
      await fetchRaces();
      return 'Races fetched';
    },

    async fetchClasses() {
      await fetchClasses();
      return 'Classes fetched';
    },
  },
};