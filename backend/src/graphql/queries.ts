import { gql } from '@apollo/client';

export const GET_USER_DUNGEON = gql`
    query GetUserDungeon($userId: ID!) {
        user(id: $userId) {
            dungeonName
            favoritedMonsters {
                id
            }
        }
    }
`;

export const UPDATE_DUNGEON_NAME = gql`
    mutation UpdateDungeonName($userId: ID!, $dungeonName: String!) {
        updateDungeonName(userId: $userId, dungeonName: $dungeonName) {
            dungeonName
        }
    }
`;

export const GET_USER_FAVORITES = gql`
    query GetUserFavorites($userId: ID!) {
        user(id: $userId) {
            favoritedMonsters {
                id
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

export const GET_MONSTER_REVIEWS = gql`
    query GetMonsterReviews($monsterId: ID!) {
        monster(id: $monsterId) {
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

export const CREATE_USER = gql`
    mutation createUser($userName: String!) {
        createUser(userName: $userName) {
            token
            user {
                id
                userName
                class {
                    name
                }
                race {
                    name
                }
                abilityScores {
                    name
                    score
                }
                equipments {
                    name
                }
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation loginUser($userName: String!) {
        loginUser(userName: $userName) {
            token
            user {
                id
                userName
                class {
                    name
                }
                race {
                    name
                }
                abilityScores {
                    name
                    score
                }
                equipments {
                    name
                }
            }
        }
    }
`;

export const CHECK_USERNAME = gql`
    query checkUsername($userName: String!) {
        checkUsername(userName: $userName)
    }
`;

