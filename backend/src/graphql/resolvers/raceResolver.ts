import Race from '../model/Race.ts';
import fetchData from '../../scripts/fetchData.js';

interface RaceArgs {
  id: string;
}

interface PaginationArgs {
  offset?: number;
  limit?: number;
}

export default {
  Query: {
    /**
     * Fetches a paginated list of races from the database.
     * @param _
     * @param offset - number of races to skip for search. Used for pagination
     * @param limit - max amount of races to fetch
     */
    async races(_: any, { offset = 0, limit = 1 }: PaginationArgs) {
      const totalRaces = await Race.countDocuments();
      const races = await Race.find().skip(offset).limit(limit);
      return { races, totalRaces };
    },

    /**
     *
     * Fetches single race based on id
     * @param _
     * @param id - id to fetch by
     *
     * @returns race object matching id
     */
    async race(_: any, { id }: RaceArgs) {
      return Race.findOne({ index: id });
    },
  },

  Mutation: {
    async fetchAllData() {
      await fetchData();
      return 'Data fetched and stored successfully!';
    },
  },
};
