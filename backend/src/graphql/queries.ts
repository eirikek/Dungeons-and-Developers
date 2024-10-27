// src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_USER_FAVORITES = gql`
    query GetUserFavorites($userId: ID!) {
        user(id: $userId) {
            favoritedMonsters {
                id
                index
                name
                size
                type
                alignment
                hit_points
                image
            }
        }
    }
`;

export const ADD_FAVORITE_MONSTER = gql`
    mutation AddFavoriteMonster($userId: ID!, $monsterId: ID!) {
        addFavoriteMonster(userId: $userId, monsterId: $monsterId) {
            favoritedMonsters {
                id
            }
        }
    }
`;

export const REMOVE_FAVORITE_MONSTER = gql`
    mutation RemoveFavoriteMonster($userId: ID!, $monsterId: ID!) {
        removeFavoriteMonster(userId: $userId, monsterId: $monsterId) {
            favoritedMonsters {
                id
            }
        }
    }
`;