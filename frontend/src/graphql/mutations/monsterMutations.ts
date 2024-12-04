import { gql } from '@apollo/client';

/**
 * MonsterMutations
 *
 * Provides GraphQL mutations for managing reviews associated with monsters.
 *
 * Features:
 * - Add new reviews for a specific monster.
 * - Delete existing reviews by review ID.
 * - Update reviews with new details.
 *
 * Mutations:
 * - `ADD_REVIEW`: Adds a new review to a monster.
 * - `DELETE_REVIEW`: Deletes a specific review from a monster.
 * - `UPDATE_REVIEW`: Updates an existing review with new data.
 */

export const ADD_REVIEW = gql`
  mutation AddReview($monsterId: ID!, $review: ReviewInput!) {
    addReview(monsterId: $monsterId, review: $review) {
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
export const DELETE_REVIEW = gql`
  mutation DeleteReview($monsterId: ID!, $reviewId: ID!) {
    deleteReview(monsterId: $monsterId, reviewId: $reviewId) {
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
export const UPDATE_REVIEW = gql`
  mutation UpdateReview($monsterId: ID!, $reviewId: ID!, $review: ReviewInput!) {
    updateReview(monsterId: $monsterId, reviewId: $reviewId, review: $review) {
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
`;
