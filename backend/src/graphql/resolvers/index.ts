import userResolver from './userResolver.ts';
import monsterResolver from './monsterResolver.ts';
import raceResolver from './raceResolver.ts';
import classResolver from './classResolver.ts';
import abilityResolver from './abilityResolver.ts';
import equipmentResolver from './equipmentResolver.js';

/**
 * Combines resolvers from different modules (user, monster, race, class, ability, and equipment)
 * into a single resolver object for use in GraphQL server.
 */

export default {
  Query: {
    ...userResolver.Query,
    ...monsterResolver.Query,
    ...raceResolver.Query,
    ...classResolver.Query,
    ...abilityResolver.Query,
    ...equipmentResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...monsterResolver.Mutation,
    ...raceResolver.Mutation,
    ...classResolver.Mutation,
    ...abilityResolver.Mutation,
    ...equipmentResolver.Mutation,
  },
};
