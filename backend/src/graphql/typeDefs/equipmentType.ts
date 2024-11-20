import { gql } from 'graphql-tag';

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
    totalCount: Int!
  }
  extend type Query {
    equipments(searchTerm: String, offset: Int, limit: Int, suggestionsOnly: Boolean): EquipmentResult!
    equipment(id: ID!): Equipment!
  }
  extend type Mutation {
    fetchEquipments: String!
  }
`;
