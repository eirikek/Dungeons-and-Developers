const {model, Schema} = require("mongoose");

const playerSchema = new Schema({
  username: String,
  userID: Number,
  characterName: String,
  class: String,
  race: String,
  abilityScores: []
});

module.exports = model("User", playerSchema);