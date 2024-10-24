import Player from '../model/Player.js';

export default {
  Query: {
    async player(_, {ID}){
      return Player.findById(ID);
    },
    async getPlayer(_, {amount}){
      return Player.find().limit(amount);
    }
  },
  Mutation: {
    async createPlayer(_, {playerInput: {username, userID ,characterName, characterClass, race, abilityScores}}){
      const createdPlayer = new Player({
        username: username,
        userID: userID,
        characterName: characterName,
        characterClass: characterClass,
        race: race,
        abilityScores: [abilityScores[0]],
      });
      const res = await createdPlayer.save();
      const playerObject = res.toObject();
      return {
        id : res.id,
        ...playerObject,
      }
    },
    async deletePlayer(_, {ID}){
      const deleted = (await Player.deleteOne({
        _id: ID,
      })).deletedCount
      return deleted
    },
    async editPlayer(_, {ID}, {playerInput: {username, userID ,characterName, characterClass, race, abilityScores}}){
      const wasEdited = (await Player.updateOne({_id: ID},
        {
          username: username,
        userID: userID,
        characterName: characterName,
        characterClass: characterClass,
        race: race,
          abilityScores: abilityScores
        } )).modifiedCount;
      return wasEdited;
    }

  }
}