import Class from '../model/Class.ts';
import fetchClasses from '../../scripts/fetchClasses.ts';

interface ClassArgs {
  id: string;
}

interface PaginationArgs {
  offset?: number;
  limit?: number;
}

export default {
  Query: {
    async classes(_: any, { offset = 0, limit = 1 }: PaginationArgs) {
      const totalClasses = await Class.countDocuments();
      const classes = await Class.find().skip(offset).limit(limit);
      return { classes, totalClasses };
    },

    async class(_: any, { id }: ClassArgs) {
      return Class.findOne({ index: id });
    },
  },

  Mutation: {
    async fetchClasses() {
      await fetchClasses();
      return 'Classes fetched!';
    },
  },
};