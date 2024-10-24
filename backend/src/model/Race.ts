import { model, Schema } from 'mongoose';

const RaceSchema = new Schema({
  index: String,
  name: String,
  speed: String,
  alignment: String,
  size: Number,
  size_description: String,
  img: String
});

export default model('Race', RaceSchema);