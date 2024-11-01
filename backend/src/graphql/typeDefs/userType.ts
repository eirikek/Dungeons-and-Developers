import { gql } from 'apollo-server';

export const userType = gql`
    type Ability {
        name: String!
        score: Int!
    }

    type Equipment {
        name: String!
    }

    type User {
        id: ID!
        userName: String!
        class: Class!
        race: Race!
        abilityScores: [Ability]!
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
    }

    extend type Mutation {
        createUser(userName: String!): AuthPayload!
        loginUser(userName: String!): AuthPayload!
        addFavoriteMonster(userId: ID!, monsterId: ID!): User!
        removeFavoriteMonster(userId: ID!, monsterId: ID!): User!
        updateDungeonName(userId: ID!, dungeonName: String!): User!
        updateUserRace(userId: ID!, raceId: ID!): User!
        updateUserClass(userId: ID!, classId: ID!): User!
    }
`;