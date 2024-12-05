import Equipment from '../model/Equipment.js';
import fetchData from '../../scripts/fetchData.js';

interface EquipmentArgs {
  id: string;
}

interface EquipmentQueryArgs {
  searchTerm?: string;
  offset?: number;
  limit?: number;
  suggestionsOnly?: boolean;
}

export default {
  Query: {
    /**
     *
     * @param _
     * @param searchTerm - term for which to be searched for
     * @param offset - number of how many equipments to skip, which is used for pagination
     * @param limit - limit of how many equipments to fetch, default value 20
     * @param suggestionsOnly - Whether to return only name suggestions (optional).
     *
     * @returns an object containing the `equipments` and `totalcount`, a count of equipments returned.
     */
    async equipments(_: any, { searchTerm = '', offset = 0, limit = 20, suggestionsOnly = false }: EquipmentQueryArgs) {
      if (suggestionsOnly) {
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const startsWithRegex = new RegExp(`^${escapedSearchTerm}`, 'i');
        const suggestions = await Equipment.find({ name: { $regex: startsWithRegex } }, 'name')
          .limit(limit)
          .lean();

        return {
          equipments: suggestions.map((equipment) => ({
            id: equipment._id,
            name: equipment.name,
            index: null,
            category: null,
            value: null,
          })),
          totalCount: suggestions.length,
        };
      }

      let equipments: any[] = [];
      let totalEquipments = 0;

      if (searchTerm) {
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const startsWithRegex = new RegExp(`^${escapedSearchTerm}`, 'i');
        const containsRegex = new RegExp(escapedSearchTerm, 'i');

        equipments = await Equipment.find({ name: { $regex: startsWithRegex } })
          .skip(offset)
          .limit(limit)
          .lean();

        if (equipments.length < limit) {
          const remainingLimit = limit - equipments.length;
          const additionalEquipments = await Equipment.find({
            name: { $regex: containsRegex },
            _id: { $nin: equipments.map((equipment) => equipment._id) },
          })
            .limit(remainingLimit)
            .lean();

          equipments = [...equipments, ...additionalEquipments];
        }

        totalEquipments = await Equipment.countDocuments({ name: { $regex: containsRegex } });
      } else {
        equipments = await Equipment.find().skip(offset).limit(limit).lean();
        totalEquipments = await Equipment.countDocuments();
      }

      return {
        equipments: equipments.map((equipment) => ({
          id: equipment._id,
          ...equipment,
        })),
        totalCount: totalEquipments,
      };
    },

    /**
     * Fetches single equipment by id
     * @param _
     * @param id - id of equipment to be fetched
     *
     * @returns specified equipment object
     * @throws Error if equipment with given ID not found
     */

    async equipment(_: any, { id }: EquipmentArgs) {
      const equipment = await Equipment.findOne({ index: id }).lean();
      if (equipment) {
        return { id: equipment._id, ...equipment };
      }
      throw new Error('Equipment not found!');
    },
  },

  Mutation: {
    /**
     * Fetches all data and stores it in database
     *
     * @returns A success message confirming the data was fetched and stored.
     * @throws Error if the `fetchData` script encounters any issues.
     */
    async fetchAllData() {
      await fetchData();
      return 'Data fetched and stored successfully!';
    },
  },
};
