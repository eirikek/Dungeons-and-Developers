import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Class from '../model/Class.js';
import Race from '../model/Race.js';
import User from '../model/User.ts';
import AbilityScore from '../model/AbilityScore.js';
import { formatDocument } from '../../utils/formatDocument.ts';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

interface UserArgs {
  userName: string;
}

export default {
  Query: {
    /**
     * Fetches single user by given id
     * @param _
     * @param id - id of user to fetch by
     * @returns The user object with populated fields.
     */

    async user(_: any, { id }: { id: string }) {
      return User.findById(id)
        .select('dungeonName')
        .populate({
          path: 'favoritedMonsters',
          select: '_id name size type alignment hit_points image',
        })
        .populate('race')
        .populate('class')
        .populate('equipments')
        .populate('abilityScores');
    },

    async checkUsername(_: any, { userName }: UserArgs) {
      const existingUser = await User.findOne({ userName });
      return !existingUser;
    },

    /**
     * Retrieves a user's ability scores.
     *
     * @param _
     * @param userId - The ID of the user.
     * @returns An array of ability scores with their details.
     */

    async getArrayScores(_: any, { userId }: { userId: string }) {
      try {
        const user = await User.findById(userId).populate('abilityScores.ability');

        if (!user) {
          throw new Error('User not found');
        }

        console.log('Fetched user with populated ability scores:', user);

        return user.abilityScores.map((abilityScore) => ({
          ability: {
            id: abilityScore.ability.id,
            name: abilityScore.ability.name,
          },
          score: abilityScore.score,
        }));
      } catch (error) {
        console.error('Error fetching ability scores:', error);
        throw new Error('Error fetching ability scores');
      }
    },
  },

  Mutation: {
    /**
     * Creates a new user with default race, class, and ability scores.
     *
     * @param _
     * @param userName - The username for the new user.
     * @returns The newly created user and a JWT token.
     * @throws Error if the username is already taken or default values are missing.
     */
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

      const defaultAbilityScores = await AbilityScore.find({});
      if (!defaultAbilityScores || defaultAbilityScores.length === 0) {
        throw new Error('No ability scores found in the database');
      }
      const user = new User({
        userName,
        race: defaultRace._id,
        class: defaultClass._id,
        abilityScores: defaultAbilityScores.map((ability) => ({
          ability: ability.id,
          score: 0,
        })),
      });

      await user.save();

      const token = jwt.sign({ id: user._id, userName: user.userName }, SECRET_KEY, { expiresIn: '2h' });

      return { user: await user.populate('race class abilityScores.ability'), token };
    },

    /**
     * Logs in a user and generates a JWT token.
     *
     * @param _
     * @param userName - The username to log in.
     * @returns The user object with populated fields and a JWT token.
     * @throws Error if the user is not found.
     */

    async loginUser(_: any, { userName }: UserArgs) {
      const user = await User.findOne({ userName })
        .populate('abilityScores.ability')
        .populate('race')
        .populate('class')
        .populate({
          path: 'favoritedMonsters',
          select: '_id name size type alignment hit_points image',
        })
        .populate('equipments');

      if (!user) throw new Error('User not found');

      console.log('Populated user during login:', user);

      const favoritedMonsters = user.favoritedMonsters.map(formatDocument);
      console.log('Formatted favoritedMonsters:', favoritedMonsters);

      const token = jwt.sign({ id: user._id, userName: user.userName }, SECRET_KEY, { expiresIn: '2h' });

      return {
        user: {
          ...user.toObject(),
          id: user._id.toString(),
          favoritedMonsters,
        },
        token,
      };
    },

    /**
     * Adds a monster to a user's favorites.
     *
     * @param _
     * @param userId - The user's ID.
     * @param monsterId - The monster's ID to add.
     * @returns The updated user with populated favorite monsters.
     * @throws Error if the user is not found.
     */

    async addFavoriteMonster(_: any, { userId, monsterId }: { userId: string; monsterId: string }) {
      const user = await User.findById(userId).populate('favoritedMonsters');
      if (!user) throw new Error('User not found');

      const monsterObjectId = new mongoose.Types.ObjectId(monsterId);

      if (!user.favoritedMonsters.some((fav) => fav._id.equals(monsterObjectId))) {
        user.favoritedMonsters.push(monsterObjectId);
        await user.save();
      }

      const populatedUser = await user.populate('favoritedMonsters');
      const favoritedMonsters = populatedUser.favoritedMonsters.map(formatDocument);

      return {
        ...populatedUser.toObject(),
        favoritedMonsters,
        id: populatedUser._id.toString(),
      };
    },

    /**
     * Deletes user with given id
     * @param _
     * @param userId - id of user to be deleted
     */

    async deleteUser(_: any, { userId }: { userId: string }) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      await User.findByIdAndDelete(userId);
      return 'User successfully deleted';
    },

    /**
     * Removes monster from favourites of user
     * @param _
     * @param userId - id of user
     * @param monsterId - id of monster to be removed
     */

    async removeFavoriteMonster(_: any, { userId, monsterId }: { userId: string; monsterId: string }) {
      const user = await User.findById(userId).populate('favoritedMonsters');
      if (!user) throw new Error('User not found');

      const monsterObjectId = new mongoose.Types.ObjectId(monsterId);

      user.favoritedMonsters.pull(monsterObjectId);
      await user.save();

      const populatedUser = await user.populate('favoritedMonsters');
      const favoritedMonsters = populatedUser.favoritedMonsters.map(formatDocument);

      return {
        ...populatedUser.toObject(),
        favoritedMonsters,
        id: populatedUser._id.toString(),
      };
    },

    /**
     * Updated dungeon name for user
     */

    async updateDungeonName(_: any, { userId, dungeonName }: { userId: string; dungeonName: string }) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      user.dungeonName = dungeonName;
      await user.save();

      return user;
    },

    /**
     *
     * Updates the race of user
     */
    async updateUserRace(_: any, { userId, raceId }: { userId: string; raceId: string }) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const race = await Race.findById(raceId);
      if (!race) throw new Error('Race not found');

      user.race = race._id;
      await user.save();

      return user.populate('race');
    },

    /**
     *
     * Updates the class of user
     */

    async updateUserClass(_: any, { userId, classId }: { userId: string; classId: string }) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const playerClass = await Class.findById(classId);
      if (!playerClass) throw new Error('Class not found');

      user.class = playerClass._id;
      await user.save();

      return user.populate('class');
    },

    /**
     * Adds equipment to character by id
     */

    async addEquipmentToCharacter(_: any, { userId, equipmentId }: { userId: string; equipmentId: string }) {
      const user = await User.findById(userId).populate('equipments');
      if (!user) throw new Error('User not found');

      const equipmentObjectId = new mongoose.Types.ObjectId(equipmentId);

      if (!user.equipments.some((equip) => equip._id.equals(equipmentObjectId))) {
        user.equipments.push(equipmentObjectId);
        await user.save();
      }
      return user.populate('equipments');
    },

    /**
     * Removes or adds equipment from a user's inventory.
     *
     */

    async updateAbilityScores(_: any, { userId, scores }: { userId: string; scores: number[] }) {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        if (scores.length !== 6) {
          throw new Error('Ability scores array must have exactly 6 elements');
        }

        const updatedAbilityScores = await AbilityScore.find({}).limit(6);
        if (updatedAbilityScores.length !== 6) {
          throw new Error('There must be exactly 6 ability scores in the database.');
        }

        user.abilityScores = updatedAbilityScores.map((ability, index) => ({
          ability: ability._id,
          score: scores[index],
        }));

        await user.save();
        await user.populate('abilityScores.ability');

        return user;
      } catch (error) {
        console.error('Error updating ability scores:', error);
        throw new Error('Failed to update ability scores.');
      }
    },

    /**
     * Removed equipment from user's character
     */

    async removeEquipmentFromCharacter(_: any, { userId, equipmentId }: { userId: string; equipmentId: string }) {
      const user = await User.findById(userId).populate('equipments');
      if (!user) throw new Error('User not found');

      const equipmentObjectId = new mongoose.Types.ObjectId(equipmentId);

      user.equipments = user.equipments.filter((equip) => !equip._id.equals(equipmentObjectId));

      await user.save();
      return user.populate('equipments');
    },

    /**
     * Removes all equipment user has previously selected
     */

    async removeAllEquipments(_: any, { userId }: { userId: string }) {
      const user = await User.findById(userId).populate('equipments');
      if (!user) throw new Error('User not found');

      const removedEquipments = user.equipments;
      user.equipments = [];
      await user.save();

      return user.populate('equipments');
    },
  },
};
