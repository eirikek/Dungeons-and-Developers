import { gql } from 'apollo-server';

export const monsterType = gql`
    type Monster {
        id: ID
        name: String!
        size: String!
        type: String!
        alignment: String!
        hit_points: Int!
        image: String
    }

    type MonsterResult {
        monsters: [Monster!]!
        totalMonsters: Int!
    }

    extend type Query {
        monsters(searchTerm: String, offset: Int, limit: Int): MonsterResult!
        monster(id: ID!): Monster!
    }

    extend type Mutation {
        fetchMonsters: String!
    }
`;