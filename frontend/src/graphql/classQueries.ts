import { gql } from '@apollo/client';

export const GET_CLASSES = gql`
  query GetClasses($offset: Int, $limit: Int) {
    classes(offset: $offset, limit: $limit) {
      classes {
        id
        index
        name
        hit_die
        skills
      }
      totalClasses
    }
  }
`;
