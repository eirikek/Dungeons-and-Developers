import userResolver from './userResolver.ts';
import monsterResolver from './monsterResolver.ts';
import raceResolver from './raceResolver.ts';
import classResolver from './classResolver.ts';
import abilityResolver from './abilityResolver.ts';

export default {
  Query: {
    ...userResolver.Query,
    ...monsterResolver.Query,
    ...raceResolver.Query,
    ...classResolver.Query,
    ...abilityResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...monsterResolver.Mutation,
    ...raceResolver.Mutation,
    ...classResolver.Mutation,
    ...abilityResolver.Mutation,
  },
};