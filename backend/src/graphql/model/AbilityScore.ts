import { model, Schema } from 'mongoose';

const AbilityScoreSchema = new Schema({
  index: { type: String, required: true },
  name: { type: String, required: true },
  skills: [{ type: String }],
});

export default model('Ability Score', AbilityScoreSchema);
