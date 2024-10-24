import Player from './../model/Player.ts';
import Monster from '../model/Monsters.ts';
import fetchMonsters from '../scripts/fetchMonsters.ts';

export default {
  Query: {
    async player(_, { ID }) {
      return Player.findById(ID);
    },
    async getPlayer(_, { amount }) {
      return Player.find().limit(amount);
    },
    async monsters() {
      return Monster.find(); // Hent alle monstre fra databasen
    },

    async monster(_, { id }) {
      return Monster.findOne({ index: id }); // Hent et spesifikt monster basert på ID
    },
  },

  Mutation: {
    async fetchMonsters() {
      await fetchMonsters(); // Kjør funksjonen som henter monstre fra API og lagrer dem i databasen
      return 'Monsters fetched and stored successfully!';
    },
    
    async createPlayer(_, { playerInput: { username, userID, characterName, characterClass, race, abilityScores } }) {
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
        id: res.id,
        ...playerObject,
      };
    },
    async deletePlayer(_, { ID }) {
      const deleted = (await Player.deleteOne({
        _id: ID,
      })).deletedCount;
      return deleted;
    },
    async editPlayer(_, { ID }, {
      playerInput: {
        username,
        userID,
        characterName,
        characterClass,
        race,
        abilityScores,
      },
    }) {
      const wasEdited = (await Player.updateOne({ _id: ID },
        {
          username: username,
          userID: userID,
          characterName: characterName,
          characterClass: characterClass,
          race: race,
          abilityScores: abilityScores,
        })).modifiedCount;
      return wasEdited;
    },

  },
};