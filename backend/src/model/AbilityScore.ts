import { model, Schema } from 'mongoose';

const SkillSchema = new Schema({
  name: { type: String, required: true },
  index: { type: String, required: true },
});

const AbilityScoreSchema = new Schema({
  index: String,
  name: String,
  desc: [String],
  skills: [SkillSchema],


});


export default model('Ability Score', AbilityScoreSchema);