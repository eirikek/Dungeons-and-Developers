import { gql } from 'apollo-server';

export const monsterType = gql`
    type Monster {
        index: String!
        name: String!
        size: String!
        type: String!
        alignment: String!
        hit_points: Int!
        hit_dice: String!
        strength: Int!
        dexterity: Int!
        intelligence: Int!
        wisdom: Int!
        charisma: Int!
        image: String
    }

    type MonsterResult {
        monsters: [Monster!]!
        totalMonsters: Int!
    }

    extend type Query {
        monsters(searchTerm: String, offset: Int, limit: Int): MonsterResult!
        monster(id: String!): Monster!
    }

    extend type Mutation {
        fetchMonsters: String!
    }
`;