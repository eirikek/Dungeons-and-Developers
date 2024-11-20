import { gql } from '@apollo/client';

export const ADD_REVIEW = gql`
  mutation AddReview($monsterId: ID!, $review: ReviewInput!) {
    addReview(monsterId: $monsterId, review: $review) {
      reviews {
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
