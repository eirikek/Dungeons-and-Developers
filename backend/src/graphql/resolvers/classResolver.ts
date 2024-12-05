import Class from '../model/Class.ts';
import fetchData from '../../scripts/fetchData.ts';

interface ClassArgs {
  id: string;
}

interface PaginationArgs {
  offset?: number;
  limit?: number;
}

export default {
  Query: {
    /**
     *
     * @param _ - unused first argument for query
     * @param offset - number of classes to skip
     * @param limit - limit of number of classes to fetch
     *
     * @returns An array of classes
     */

    async classes(_: any, { offset = 0, limit = 1 }: PaginationArgs) {
      const totalClasses = await Class.countDocuments();
      const classes = await Class.find().skip(offset).limit(limit);
      return { classes, totalClasses };
    },

    /**
     * fetches single class by id
     * @param _
     * @param id - id of class to be fetched
     */

    async class(_: any, { id }: ClassArgs) {
      return Class.findOne({ index: id });
    },
  },

  Mutation: {
    /**
     * Fetches all data and stores in database
     *
     * @returns A success message confirming that the data was fetched and stored.
     */
    async fetchAllData() {
      await fetchData();
      return 'Data fetched and stored successfully!';
    },
  },
};
