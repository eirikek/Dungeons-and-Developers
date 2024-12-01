import { model, Schema, Types } from 'mongoose';

const reviewSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  difficulty: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

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
