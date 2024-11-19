import { gql } from 'graphql-tag';

export const abilityType = gql`
  type AbilityScore {
    id: ID!
    name: String!
    index: String!
    skills: [String]
  }

  type AbilityResult {
    abilities: [AbilityScore!]!
    totalAbilities: Int!
  }

  extend type Query {
    abilities(offset: Int, limit: Int): AbilityResult!
    ability(id: String!): AbilityScore
  }
`;
