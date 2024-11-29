import { gql } from '@apollo/client';

export const GET_MONSTERS = gql`
  query GetMonsters(
    $searchTerm: String
    $offset: Int
    $limit: Int
    $types: [String!]
    $minHp: Int
    $maxHp: Int
    $sortOption: String
  ) {
    monsters(
      searchTerm: $searchTerm
      offset: $offset
      limit: $limit
      types: $types
      minHp: $minHp
      maxHp: $maxHp
      sortOption: $sortOption
    ) {
      monsters {
        id
        name
        size
        type
        alignment
        hit_points
        image
        averageDifficulty
        reviewsCount
      }
      totalMonsters
      minHp
      maxHp
    }
  }
`;

export const GET_MONSTER_TYPE_COUNTS = gql`
  query GetMonsterTypeCounts($minHp: Int, $maxHp: Int) {
    monsterTypeCounts(minHp: $minHp, maxHp: $maxHp) {
      type
      count
    }
  }
`;

export const GET_MONSTER_HP_RANGE = gql`
  query GetMonsterHpRange {
    monsterHpRange {
      minHp
      maxHp
    }
  }
`;

export const GET_MONSTER_SUGGESTIONS = gql`
  query GetMonsterSuggestions($searchTerm: String, $types: [String!], $minHp: Int, $maxHp: Int) {
    monsters(searchTerm: $searchTerm, types: $types, minHp: $minHp, maxHp: $maxHp) {
      monsters {
        id
        name
      }
    }
  }
`;

export const GET_MONSTER_REVIEWS = gql`
  query GetMonsterReviews($monsterId: ID!) {
    monster(id: $monsterId) {
      id
      reviews {
        id
        user {
          id
          userName
        }
        difficulty
        description
        createdAt
      }
    }
  }
`;
