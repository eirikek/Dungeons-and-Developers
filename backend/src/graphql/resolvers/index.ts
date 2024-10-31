import userResolver from './userResolver.ts';
import monsterResolver from './monsterResolver.ts';
import raceResolver from './raceResolver.ts';
import classResolver from './classResolver.ts';
import equipmentResolver from './equipmentResolver.js';

export default {
  Query: {
    ...userResolver.Query,
    ...monsterResolver.Query,
    ...raceResolver.Query,
    ...classResolver.Query,
    ...equipmentResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...monsterResolver.Mutation,
    ...raceResolver.Mutation,
    ...classResolver.Mutation,
    ...equipmentResolver.Mutation,
  },
};
