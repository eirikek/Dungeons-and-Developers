import User from '../model/User.ts';
import Race from '../model/Race.ts';
import Class from '../model/Class.ts';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

interface UserArgs {
  userName: string;
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
  },
};