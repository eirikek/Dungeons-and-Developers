import { model, Schema } from 'mongoose';

const playerSchema = new Schema({
  userName: String,
  class: String,
  race: String,
  abilityScores: [],
  equipments: [],
});

export default model('User', playerSchema);