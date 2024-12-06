import { model, Schema } from 'mongoose';

/**
 * Represents the schema for an equipment item in the database.
 * Each equipment item includes an index, name, category, and value.
 */

const EquipmentSchema = new Schema({
  index: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  value: { type: Number, required: true },
});

export default model('Equipment', EquipmentSchema);
