import { gql } from 'apollo-server';
import { classType } from './classType.ts';
import { monsterType } from './monsterType.ts';
import { raceType } from './raceType.ts';
import { userType } from './userType.ts';
import { equipmentType } from './equipmentType.js';

const baseType = gql`
  type Query
  type Mutation {
    fetchAllData: String!
  }
`;

export default [baseType, classType, monsterType, raceType, userType, equipmentType];
