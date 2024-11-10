import Monster from '../model/Monsters.ts';
import User from '../model/User.ts';
import fetchData from '../../scripts/fetchData.js';

interface MonsterArgs {
  id: string;
}

interface MonsterQueryArgs {
  searchTerm?: string;
  offset?: number;
  limit?: number;
  types?: string[];
  minHp?: number;
  maxHp?: number;
}

interface ReviewInput {
  user: string;
  difficulty: number;
  description: string;
}

export default {
  Query: {
    async monsters(_: any, { searchTerm = '', offset = 0, limit = 8, types = [], minHp, maxHp }: MonsterQueryArgs) {
      let query: any = {};

      if (types.length > 0) {
        query.type = { $in: types };
      }

      if (minHp !== undefined && maxHp !== undefined) {
        query.hit_points = { $gte: minHp, $lte: maxHp };
      }

      let monsters: any[] = [];
      let totalMonsters: number = 0;

      if (searchTerm) {
        const startsWithRegex = new RegExp(`^${searchTerm}`, 'i');
        const containsRegex = new RegExp(searchTerm, 'i');

        query.name = { $regex: startsWithRegex };
        monsters = await Monster.find(query).skip(offset).limit(limit);

        if (monsters.length < limit) {
          const remainingLimit = limit - monsters.length;
          query.name = { $regex: containsRegex };
          query._id = { $nin: monsters.map((m) => m._id) };

          const additionalMonsters = await Monster.find(query)
            .skip(offset + monsters.length)
            .limit(remainingLimit);

          monsters = [...monsters, ...additionalMonsters];
        }

        query.name = { $regex: containsRegex };
        totalMonsters = await Monster.countDocuments(query);
      } else {
        monsters = await Monster.find(query).skip(offset).limit(limit);
        totalMonsters = await Monster.countDocuments(query);
      }

      const minHpValue = await Monster.findOne(query)
        .sort({ hit_points: 1 })
        .then((m) => m?.hit_points ?? 1);
      const maxHpValue = await Monster.findOne(query)
        .sort({ hit_points: -1 })
        .then((m) => m?.hit_points ?? 1000);

      return { monsters, totalMonsters, minHp: minHpValue, maxHp: maxHpValue };
    },

    async monster(_: any, { id }: MonsterArgs) {
      return Monster.findById(id).populate({
        path: 'reviews.user',
        select: 'id userName',
      });
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

      const user = await User.findById(review.user);
      if (!user) throw new Error('User not found');

      const fullReview = {
        user: user._id,
        difficulty: review.difficulty,
        description: review.description,
        createdAt: new Date().toISOString(),
      };

      monster.reviews.push(fullReview);
      await monster.save();

      return Monster.findById(monsterId).populate({
        path: 'reviews.user',
        select: 'id userName',
      });
    },

    async deleteReview(_: any, { monsterId, reviewId }: { monsterId: string; reviewId: string }) {
      try {
        const monster = await Monster.findById(monsterId);
        if (!monster) throw new Error('Monster not found');

        const reviewIndex = monster.reviews.findIndex((review) => review._id.toString() === reviewId);
        if (reviewIndex === -1) throw new Error('Review not found');

        monster.reviews.splice(reviewIndex, 1);
        await monster.save();

        return Monster.findById(monsterId).populate({
          path: 'reviews.user',
          select: 'id userName',
        });
      } catch (error) {
        console.error('Error in deleteReview resolver:', error);
        throw error;
      }
    },

    async updateReview(
      _: any,
      {
        monsterId,
        reviewId,
        review,
      }: {
        monsterId: string;
        reviewId: string;
        review: ReviewInput;
      }
    ) {
      const monster = await Monster.findById(monsterId);
      if (!monster) throw new Error('Monster not found');

      const reviewToUpdate = monster.reviews.id(reviewId);
      if (!reviewToUpdate) throw new Error('Review not found');

      reviewToUpdate.difficulty = review.difficulty;
      reviewToUpdate.description = review.description;

      await monster.save();

      return Monster.findById(monsterId)
        .populate({
          path: 'reviews.user',
          select: 'id userName',
        })
        .then((monster) => monster?.reviews.id(reviewId));
    },
  },
};
