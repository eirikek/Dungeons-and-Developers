import { MockedResponse } from '@apollo/client/testing';
import { MonsterCardProps } from '../../src/interfaces/MonsterCardProps.ts';
import { UPDATE_DUNGEON_NAME } from '../../src/graphql/updateUserQueries.ts';
import { GET_MONSTER_REVIEWS } from '../../src/graphql/getMonsterQuerie.ts';
import { GET_USER_DUNGEON_NAME } from '../../src/graphql/userQueries.ts';

interface UserDungeonData {
  dungeonName: string;
  favoritedMonsters: MonsterCardProps[];
}

interface MonsterReviewsData {
  monster: {
    reviews: {
      id: string;
      user: {
        id: string;
        userName: string;
      };
      difficulty: number;
      description: string;
      createdAt: string;
    }[];
  };
}

export const generateGetUserDungeonMock = (userId: string, data: UserDungeonData): MockedResponse => ({
  request: {
    query: GET_USER_DUNGEON_NAME,
    variables: { userId },
  },
  result: {
    data: {
      user: {
        dungeonName: data.dungeonName,
        favoritedMonsters: data.favoritedMonsters,
      },
    },
  },
});

export const generateUpdateDungeonNameMock = (userId: string, newName: string): MockedResponse => ({
  request: {
    query: UPDATE_DUNGEON_NAME,
    variables: { userId, dungeonName: newName },
  },
  result: {
    data: {
      updateDungeonName: {
        dungeonName: newName,
      },
    },
  },
});

export const generateGetMonsterReviewsMock = (
  monsterId: string,
  reviews: MonsterReviewsData['monster']['reviews']
): MockedResponse => ({
  request: {
    query: GET_MONSTER_REVIEWS,
    variables: { monsterId },
  },
  result: {
    data: {
      monster: {
        reviews,
      },
    },
  },
});
