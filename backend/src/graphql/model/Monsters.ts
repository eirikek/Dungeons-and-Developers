import { model, Schema } from 'mongoose';

const monsterSchema = new Schema({
  name: String,
  size: String,
  type: String,
  alignment: String,
  hit_points: Number,
  image: String,
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// virtual field `id` that returns `_id` as a string
monsterSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export default model('Monster', monsterSchema);