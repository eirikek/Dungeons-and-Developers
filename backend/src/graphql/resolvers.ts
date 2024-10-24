import Player from './../model/Player.ts';
import Monster from '../model/Monsters.ts';
import fetchMonsters from '../scripts/fetchMonsters.ts';
import Race from '../model/Race.ts';
import fetchRaces from '../scripts/fetchRaces.ts'


export default {
  Query: {
    async races(_, offset = 0, limit= 1) {
      const totalRaces = await Race.countDocuments();
      const races = await Race.find().skip(offset).limit(limit)
      return {races, totalRaces};
    },

    async player(_, { ID }) {
      return Player.findById(ID);
    },
    async getPlayer(_, { amount }) {
      return Player.find().limit(amount);
    },
    async monsters(_, { searchTerm = '', offset = 0, limit = 8 }) {
      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } }
        : {};

      const totalMonsters = await Monster.countDocuments(query);

      const monsters = await Monster.find(query)
        .skip(offset)
        .limit(limit);

      return {
        monsters,
        totalMonsters,
      };


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

    async fetchRaces(){
      await fetchRaces();
      return 'Races fetched'
    }



  },
};