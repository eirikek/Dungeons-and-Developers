import Equipment from '../model/Equipment.js';
import fetchData from '../../scripts/fetchData.js';
import User from '../model/User.js';
import { Types } from 'mongoose';

interface EquipmentArgs {
  id: string;
}

interface PaginationArgs {
  offset?: number;
  limit?: number;
}

export default {
  Query: {
    async equipments(_: any, { offset = 0, limit = 20 }: PaginationArgs) {
      const totalEquipments = await Equipment.countDocuments();
      const equipments = await Equipment.find().skip(offset).limit(limit).lean();

      const equipmentsWithId = equipments.map((equipment) => ({
        id: equipment._id,
        ...equipment,
      }));

      return {
        results: equipmentsWithId,
        totalCount: totalEquipments,
      };
    },
    async equipment(_: any, { id }: EquipmentArgs) {
      const equipment = await Equipment.findOne({ index: id }).lean();
      if (equipment) {
        return { id: equipment._id, ...equipment };
      }
      throw new Error('Equipment not found!');
    },
  },

  Mutation: {
    async addEquipmentToCharacter(_: any, { userId, equipmentId }: { userId: string; equipmentId: string }) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        throw new Error('Equipment not found');
      }
      const equipmentObjectId = new Types.ObjectId(equipmentId);

      if (!user.equipments.includes(equipmentObjectId)) {
        user.equipments.push(equipmentObjectId);
      }
      await user.save();

      return {
        id: user._id,
        userName: user.userName,
        equipments: await Equipment.find({ _id: { $in: user.equipments } }),
      };
    },
    async fetchAllData() {
      await fetchData();
      return 'Data fetched and stored successfully!';
    },
  },
};
