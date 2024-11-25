import { gql } from '@apollo/client';

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
