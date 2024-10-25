import { model, Schema } from 'mongoose';

const ClassSchema = new Schema({
  index: String,
  name: String,
  hit_die: Number,

});

export default model('Class', ClassSchema);