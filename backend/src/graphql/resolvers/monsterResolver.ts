import { Types } from 'mongoose';
import fetchData from '../../scripts/fetchData.js';
import { formatDocument } from '../../utils/formatDocument.js';
import Monster from '../model/Monsters.ts';
import User from '../model/User.ts';

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
  sortOption?: string;
  suggestionsOnly?: boolean;
}

interface ReviewInput {
  user: string;
  difficulty: number;
  description: string;
}

interface Review {
  _id: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    userName: string;
  };
  difficulty: number;
  description: string;
  createdAt: string;
}

interface MonsterTypeCountsArgs {
  minHp?: number;
  maxHp?: number;
}

export default {
  Query: {
    async monsters(
      _: any,
      {
        searchTerm = '',
        offset = 0,
        limit = 8,
        types = [],
        minHp,
        maxHp,
        sortOption = 'name-asc',
        suggestionsOnly = false,
      }: MonsterQueryArgs
    ) {
      let query: any = {};
      let sort: any = {};

      if (types.length > 0) {
        query.type = { $in: types };
      }

      if (minHp !== undefined && maxHp !== undefined) {
        query.hit_points = { $gte: minHp, $lte: maxHp };
      }

      if (searchTerm) {
        query.name = { $regex: new RegExp(searchTerm, 'i') };
      }

      if (suggestionsOnly) {
        query.name = { $regex: new RegExp(`^${searchTerm}`, 'i') };
        return Monster.find(query, 'id name').limit(limit);
      }
      const hasReviewsForCount = await Monster.exists({ ...query, 'reviews.0': { $exists: true } });

      switch (sortOption) {
        case 'name-asc':
          sort = { name: 1 };
          break;
        case 'name-desc':
          sort = { name: -1 };
          break;
        case 'difficulty-asc':
        case 'difficulty-desc':
          const sortDirection = sortOption === 'difficulty-asc' ? 1 : -1;

          if (!hasReviewsForCount) {
            sort = { name: 1 };
            break;
          }

          const monstersWithCalculations = await Monster.aggregate([
            { $match: query },
            {
              $addFields: {
                averageDifficulty: {
                  $cond: {
                    if: { $gt: [{ $size: '$reviews' }, 0] },
                    then: { $avg: '$reviews.difficulty' },
                    else: 0,
                  },
                },
                reviewsCount: { $size: '$reviews' },
              },
            },
            {
              $sort: { averageDifficulty: sortDirection },
            },
            { $skip: offset },
            { $limit: limit },
            {
              $project: {
                id: '$_id',
                name: 1,
                size: 1,
                type: 1,
                alignment: 1,
                hit_points: 1,
                image: 1,
                reviews: 1,
                averageDifficulty: 1,
                reviewsCount: 1,
              },
            },
          ]);

          const formattedMonstersByDifficulty = monstersWithCalculations.map((monster) => formatDocument(monster));

          const totalMonsters = await Monster.countDocuments(query);
          console.log(totalMonsters);
          const minHpValue = await Monster.findOne(query)
            .sort({ hit_points: 1 })
            .then((m) => m?.hit_points ?? 1);
          const maxHpValue = await Monster.findOne(query)
            .sort({ hit_points: -1 })
            .then((m) => m?.hit_points ?? 1000);

          return {
            monsters: formattedMonstersByDifficulty || [],
            totalMonsters,
            minHp: minHpValue,
            maxHp: maxHpValue,
          };

        case 'reviews-desc':
          if (!hasReviewsForCount) {
            sort = { name: 1 };
            break;
          }
          const monstersByReviews = await Monster.aggregate([
            { $match: query },
            {
              $addFields: {
                reviewsCount: { $size: '$reviews' },
              },
            },
            { $sort: { reviewsCount: -1 } },
            { $skip: offset },
            { $limit: limit },
            {
              $project: {
                id: '$_id',
                name: 1,
                size: 1,
                type: 1,
                alignment: 1,
                hit_points: 1,
                image: 1,
                reviews: 1,
                reviewsCount: 1,
              },
            },
          ]);

          const formattedMonstersByReviews = monstersByReviews.map((monster) => formatDocument(monster));

          const totalMonstersByReviews = await Monster.countDocuments(query);
          const minHpValueByReviews = await Monster.findOne(query)
            .sort({ hit_points: 1 })
            .then((m) => m?.hit_points ?? 1);
          const maxHpValueByReviews = await Monster.findOne(query)
            .sort({ hit_points: -1 })
            .then((m) => m?.hit_points ?? 1000);

          return {
            monsters: formattedMonstersByReviews || [],
            totalMonsters: totalMonstersByReviews,
            minHp: minHpValueByReviews,
            maxHp: maxHpValueByReviews,
          };

        default:
          sort = { name: 1 };
      }

      let monsters: any[] = [];
      let totalMonsters: number = 0;

      if (searchTerm) {
        const startsWithRegex = new RegExp(`^${searchTerm}`, 'i');
        const containsRegex = new RegExp(searchTerm, 'i');

        monsters = await Monster.find({ ...query, name: { $regex: startsWithRegex } })
          .sort(sort)
          .skip(offset)
          .limit(limit);

        if (monsters.length < limit) {
          const remainingLimit = limit - monsters.length;
          const additionalMonsters = await Monster.find({
            ...query,
            name: { $regex: containsRegex },
            _id: { $nin: monsters.map((m) => m._id) },
          })
            .sort(sort)
            .skip(offset)
            .limit(remainingLimit);

          monsters = [...monsters, ...additionalMonsters];
        }

        totalMonsters = await Monster.countDocuments({ ...query, name: { $regex: containsRegex } });
      } else {
        monsters = await Monster.find(query).sort(sort).skip(offset).limit(limit);
        totalMonsters = await Monster.countDocuments(query);
      }

      const formattedMonsters = monsters.map((monster) => formatDocument(monster));

      const minHpValue = await Monster.findOne(query)
        .sort({ hit_points: 1 })
        .then((m) => m?.hit_points ?? 1);
      const maxHpValue = await Monster.findOne(query)
        .sort({ hit_points: -1 })
        .then((m) => m?.hit_points ?? 1000);

      return { monsters: formattedMonsters || [], totalMonsters, minHp: minHpValue, maxHp: maxHpValue };
    },

    async monster(_: any, { id }: MonsterArgs) {
      const monster = await Monster.findById(id).populate({
        path: 'reviews.user',
        select: 'id userName',
      });

      if (!monster) throw new Error('Monster not found');

      const formattedMonster = formatDocument(monster);

      const formattedReviews = monster.reviews.map((review: any) => ({
        id: review._id.toString(),
        user: {
          id: review.user._id ? review.user._id.toString() : '',
          userName: review.user.userName || 'Unknown',
        },
        difficulty: review.difficulty,
        description: review.description,
        createdAt: review.createdAt,
      }));

      return {
        ...formattedMonster,
        reviews: formattedReviews,
      };
    },

    async monsterTypeCounts(_: any, { minHp, maxHp }: MonsterTypeCountsArgs) {
      const matchStage: Partial<{ hit_points: { $gte: number; $lte: number } }> = {};
      if (minHp !== undefined && maxHp !== undefined) {
        matchStage.hit_points = { $gte: minHp, $lte: maxHp };
      }

      return Monster.aggregate([
        { $match: matchStage },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } },
      ]);
    },

    async monsterHpRange() {
      const minHpMonster = await Monster.findOne().sort({ hit_points: 1 });
      const maxHpMonster = await Monster.findOne().sort({ hit_points: -1 });

      return {
        minHp: minHpMonster?.hit_points || 1,
        maxHp: maxHpMonster?.hit_points || 1000,
      };
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
