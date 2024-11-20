import { gql } from '@apollo/client';

export const ADD_EQUIPMENT_TO_CHARACTER = gql`
  mutation AddEquipmentToCharacter($userId: ID!, $equipmentId: ID!) {
    addEquipmentToCharacter(userId: $userId, equipmentId: $equipmentId) {
      id
      equipments {
        id
        index
        name
        category
        value
      }
    }
  }
`;

export const REMOVE_EQUIPMENT_FROM_CHARACTER = gql`
  mutation RemoveEquipmentFromCharacter($userId: ID!, $equipmentId: ID!) {
    removeEquipmentFromCharacter(userId: $userId, equipmentId: $equipmentId) {
      id
      equipments {
        id
        index
        name
        category
        value
      }
    }
  }
`;

export const GET_EQUIPMENT_SUGGESTIONS = gql`
  query GetEquipmentSuggestions($searchTerm: String!) {
    equipments(searchTerm: $searchTerm, suggestionsOnly: true) {
      equipments {
        id
        name
      }
      totalCount
    }
  }
`;

export const REMOVE_ALL_EQUIPMENTS = gql`
  mutation RemoveAllEquipments($userId: ID!) {
    removeAllEquipments(userId: $userId) {
      id
      equipments {
        id
        name
        category
        value
      }
    }
  }
`;
export const GET_EQUIPMENTS = gql`
  query GetEquipments($searchTerm: String, $offset: Int, $limit: Int) {
    equipments(searchTerm: $searchTerm, offset: $offset, limit: $limit) {
      equipments {
        id
        index
        name
        category
        value
      }
      totalCount
    }
  }
`;
