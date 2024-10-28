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
        reviews: [Review!]!
    }

    type MonsterResult {
        monsters: [Monster!]!
        totalMonsters: Int!
    }

    type Review {
        id: ID!
        user: User!
        difficulty: Int!
        description: String!
        createdAt: String!
    }

    input ReviewInput {
        user: ID!
        difficulty: Int!
        description: String!
    }

    extend type Query {
        monsters(searchTerm: String, offset: Int, limit: Int): MonsterResult!
        monster(id: ID!): Monster!
    }

    extend type Mutation {
        fetchMonsters: String!
        addReview(monsterId: ID!, review: ReviewInput!): Monster!
        deleteReview(monsterId: ID!, reviewId: ID!): Monster!
    }
`;