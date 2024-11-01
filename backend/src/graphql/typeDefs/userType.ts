import { gql } from 'apollo-server';

export const userType = gql`
  type Ability {
    name: String!
    score: Int!
  }

  type UserEquipments {
    equipments: [Equipment!]
  }
  type User {
    id: ID!
    userName: String!
    class: Class!
    race: Race!
    abilityScores: [Ability]!
    equipments: [Equipment!]
    favoritedMonsters: [Monster!]!
    dungeonName: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type AddEquipmentToCharacterResult {
    user: User!
    equipments: [Equipment!]!
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
    addEquipmentToCharacter(userId: ID!, equipmentId: ID!): User!
    removeFavoriteMonster(userId: ID!, monsterId: ID!): User!
    removeEquipmentFromCharacter(userId: ID!, equipmentId: ID!): User!
    updateDungeonName(userId: ID!, dungeonName: String!): User!
  }
`;
