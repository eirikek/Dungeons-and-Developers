import { model, Schema } from 'mongoose';

const RaceSchema = new Schema({
  index: { type: String, required: true },
  name: { type: String, required: true },
  speed: { type: Number, required: true },
  alignment: { type: String, required: true },
  size: { type: String, required: true },
  size_description: { type: String, required: true },
});

export default model('Race', RaceSchema);
