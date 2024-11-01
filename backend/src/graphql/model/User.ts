import { model, Schema, Types } from 'mongoose';

const playerSchema = new Schema({
  userName: String,
  class: { type: Types.ObjectId, ref: 'Class' },
  race: { type: Types.ObjectId, ref: 'Race' },
  abilityScores: [],
  equipments: [{ type: Schema.Types.ObjectId, ref: 'Equipment' }],
  favoritedMonsters: [{ type: Types.ObjectId, ref: 'Monster' }],
  dungeonName: { type: String, default: 'My Dungeon' },
});

export default model('User', playerSchema);
