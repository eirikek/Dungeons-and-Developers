import { gql } from 'apollo-server';

export const abilityType = gql`
    type AbilityScore{
        name: String!
        index: String!
        desc: [String!]!
        skills: [Skills!]!
    }
    type Skills{
        name: String!
        index: String!
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