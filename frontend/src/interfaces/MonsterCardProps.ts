import { ReviewType } from './ReviewProps.ts';

export interface MonsterCardProps {
  id: string;
  name: string;
  type: string;
  hit_points: number;
  alignment: string;
  size: string;
  image?: string;
}

export interface Monster {
  id: string;
  name: string;
  reviews: ReviewType[];
}

// Query result for GET_MONSTER_REVIEWS
export interface GetMonsterReviewsData {
  monster: Monster;
}

// Mutation result for ADD_REVIEW
export interface AddReviewData {
  addReview: Monster;
}

// Mutation result for UPDATE_REVIEW
export interface UpdateReviewData {
  updateReview: ReviewType;
}
