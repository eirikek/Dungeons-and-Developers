import { model, Schema } from 'mongoose';

const monsterSchema = new Schema({
  index: String,
  name: String,
  size: String,
  type: String,
  alignment: String,
  hit_points: Number,
  image: String,
});

export default model('Monster', monsterSchema);