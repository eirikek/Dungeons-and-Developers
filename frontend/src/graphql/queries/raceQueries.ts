import { gql } from '@apollo/client';

export const GET_RACES = gql`
  query GetRaces($offset: Int, $limit: Int) {
    races(offset: $offset, limit: $limit) {
      races {
        id
        index
        name
        speed
        alignment
        size
      }
      totalRaces
    }
  }
`;
