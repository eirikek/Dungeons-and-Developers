import { model, Schema } from 'mongoose';

const AbilityScoreSchema = new Schema({
  index: { type: String, required: true },
  name: { type: String, required: true },
  skills: [{ type: String }],
});

AbilityScoreSchema.virtual('id').get(function () {
  return this._id.toString();
});

AbilityScoreSchema.set('toObject', { virtuals: true });
AbilityScoreSchema.set('toJSON', { virtuals: true });

export default model('Ability Score', AbilityScoreSchema);
