import { model, Schema } from 'mongoose';

/**
 * Represents the schema for an ability score in the database.
 * Ability scores include properties such as `index`, `name`, and associated `skills`.
 */

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
