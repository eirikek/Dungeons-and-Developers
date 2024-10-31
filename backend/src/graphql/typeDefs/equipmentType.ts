import { gql } from 'apollo-server';

export const equipmentType = gql`
  type Equipment {
    id: ID!
    index: String!
    name: String!
    category: String!
    value: Int!
  }
  type EquipmentResult {
    equipments: [Equipment!]!
    totalEquipments: Int!
  }
  extend type Query {
    equipments(offset: Int, limit: Int): EquipmentResult!
    equipment(id: ID!): Equipment!
  }
  extend type Mutation {
    fetchEquipments: String!
  }
  extend type Mutation {
    addEquipmentToCharacter(userId: ID!, equipmentId: ID!): User
  }
`;
