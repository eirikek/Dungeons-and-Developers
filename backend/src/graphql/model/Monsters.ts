import { model, Schema, Types } from 'mongoose';

/**
 * Schema for the reviews of monsters
 * References user, includes difficulty, description and date created at.
 */

const reviewSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  difficulty: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

/**
 * Schema for a monster entity in the database.
 * This schema includes details such as name, size, type, alignment, hit points, image URL, and associated reviews.
 */

const monsterSchema = new Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  type: { type: String, required: true },
  alignment: { type: String, required: true },
  hit_points: { type: Number, required: true },
  image: { type: String, required: false },
  reviews: [reviewSchema],
});

export default model('Monster', monsterSchema);
