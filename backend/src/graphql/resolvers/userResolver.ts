import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Class from '../model/Class.js';
import Race from '../model/Race.js';
import User from '../model/User.ts';
import AbilityScore from '../model/AbilityScore.js';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

interface UserArgs {
  userName: string;
}

export default {
  Query: {
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

    async loginUser(_: any, { userName }: UserArgs) {
      const user = await User.findOne({ userName })
        .populate('abilityScores.ability')
        .populate('race')
        .populate('class')
        .populate('favoritedMonsters')
        .populate({
          path: 'equipments',
          model: 'Equipment',
          select: 'id name category value',
        });

      if (!user) throw new Error('User not found');

      const token = jwt.sign({ id: user._id, userName: user.userName }, SECRET_KEY, { expiresIn: '2h' });

      return { user, token };
    },

    async addFavoriteMonster(_: any, { userId, monsterId }: { userId: string; monsterId: string }) {
      const user = await User.findById(userId).populate('favoritedMonsters');
      if (!user) throw new Error('User not found');

      const monsterObjectId = new mongoose.Types.ObjectId(monsterId);

      if (!user.favoritedMonsters.some((fav) => fav._id.equals(monsterObjectId))) {
        user.favoritedMonsters.push(monsterObjectId);
        await user.save();
      }

      const populatedUser = await user.populate('favoritedMonsters');
      const favoritedMonsters = populatedUser.favoritedMonsters.map((monster: any) => ({
        ...monster.toObject(),
        id: monster._id.toString(),
        image: monster.image
          ? `data:image/webp;base64,${Buffer.isBuffer(monster.image) ? monster.image.toString('base64') : monster.image}`
          : null,
      }));

      return {
        ...populatedUser.toObject(),
        favoritedMonsters,
        id: populatedUser._id.toString(),
      };
    },

    async deleteUser(_: any, { userId }: { userId: string }) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      await User.findByIdAndDelete(userId);
      return 'User successfully deleted';
    },

    async removeFavoriteMonster(_: any, { userId, monsterId }: { userId: string; monsterId: string }) {
      const user = await User.findById(userId).populate('favoritedMonsters');
      if (!user) throw new Error('User not found');

      const monsterObjectId = new mongoose.Types.ObjectId(monsterId);

      user.favoritedMonsters.pull(monsterObjectId);
      await user.save();

      const populatedUser = await user.populate('favoritedMonsters');
      const favoritedMonsters = populatedUser.favoritedMonsters.map((monster: any) => ({
        ...monster.toObject(),
        id: monster._id.toString(),
        image: monster.image
          ? `data:image/webp;base64,${Buffer.isBuffer(monster.image) ? monster.image.toString('base64') : monster.image}`
          : null, // Safely handle `image`
      }));

      return {
        ...populatedUser.toObject(),
        favoritedMonsters,
        id: populatedUser._id.toString(), // Map `_id` to `id`
      };
    },

    async updateDungeonName(_: any, { userId, dungeonName }: { userId: string; dungeonName: string }) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      user.dungeonName = dungeonName;
      await user.save();

      return user;
    },

    async updateUserRace(_: any, { userId, raceId }: { userId: string; raceId: string }) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const race = await Race.findById(raceId);
      if (!race) throw new Error('Race not found');

      user.race = race._id;
      await user.save();

      return user.populate('race');
    },

    async updateUserClass(_: any, { userId, classId }: { userId: string; classId: string }) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const playerClass = await Class.findById(classId);
      if (!playerClass) throw new Error('Class not found');

      user.class = playerClass._id;
      await user.save();

      return user.populate('class');
    },

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

    async removeEquipmentFromCharacter(_: any, { userId, equipmentId }: { userId: string; equipmentId: string }) {
      const user = await User.findById(userId).populate('equipments');
      if (!user) throw new Error('User not found');

      const equipmentObjectId = new mongoose.Types.ObjectId(equipmentId);

      user.equipments = user.equipments.filter((equip) => !equip._id.equals(equipmentObjectId));

      await user.save();
      return user.populate('equipments');
    },

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
