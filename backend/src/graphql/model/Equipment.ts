import { model, Schema } from 'mongoose';

const EquipmentSchema = new Schema({
  index: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  value: { type: Number, required: true },
});

export default model('Equipment', EquipmentSchema);
