import Monster from '../model/Monsters.ts';
import fetchMonsters from '../scripts/fetchMonsters.ts';
import Race from '../model/Race.ts';
import fetchRaces from '../scripts/fetchRaces.ts'



export default {
  Query: {
    async races(_: any, offset = 0, limit= 1) {
      const totalRaces = await Race.countDocuments();
      const races = await Race.find().skip(offset).limit(limit)
      return {races, totalRaces};
    },

    async monsters(_:any, {searchTerm = '', offset = 0, limit = 8 }) {
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

    async monster(_:any, { id }:any) {
      return Monster.findOne({ index: id }); // Hent et spesifikt monster basert på ID
    },

    async race(_:any,{id}:any){
      return Race.findOne({index:id})
    }
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