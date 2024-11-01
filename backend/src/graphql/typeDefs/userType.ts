import { gql } from 'apollo-server';

export const userType = gql`

    type Equipment {
        name: String!
    }

    type User {
        id: ID!
        userName: String!
        class: Class!
        race: Race!
        abilityScores: [Int!]!
        equipments: [Equipment]!
        favoritedMonsters: [Monster!]!
        dungeonName: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    extend type Query {
        getUser(amount: Int): [User]
        checkUsername(userName: String!): Boolean!
        user(id: ID!): User!
        getArrayScores(userId: ID!): [Int!]!
    }

    extend type Mutation {
        createUser(userName: String!): AuthPayload!
        loginUser(userName: String!): AuthPayload!
        addFavoriteMonster(userId: ID!, monsterId: ID!): User!
        removeFavoriteMonster(userId: ID!, monsterId: ID!): User!
        updateDungeonName(userId: ID!, dungeonName: String!): User!
        updateUserRace(userId: ID!, raceId: ID!): User!
        updateUserClass(userId: ID!, classId: ID!): User!
        updateAbilityScores(userId: ID!, scores: [Int!]!): User!
    }
`;