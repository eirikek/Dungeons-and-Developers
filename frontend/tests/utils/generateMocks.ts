import { MockedResponse } from '@apollo/client/testing';
import { MonsterCardProps } from '../../src/interfaces/MonsterCardProps';
import { UPDATE_DUNGEON_NAME } from '../../src/graphql/mutations/userMutations';
import { GET_MONSTER_REVIEWS } from '../../src/graphql/queries/monsterQueries';
import { GET_USER_DUNGEON_NAME } from '../../src/graphql/queries/userQueries';
import { GET_USER_FAVORITES } from '../../src/graphql/queries/userQueries';

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

export const generateGetUserFavoritesMock = (
  userId: string,
  favoritedMonsters: MonsterCardProps[]
): MockedResponse => ({
  request: {
    query: GET_USER_FAVORITES,
    variables: { userId },
  },
  result: {
    data: {
      user: {
        id: userId,
        favoritedMonsters,
      },
    },
  },
});

export const generateGetUserDungeonMock = (userId: string, data: UserDungeonData): MockedResponse => ({
  request: {
    query: GET_USER_DUNGEON_NAME,
    variables: { userId },
  },
  result: {
    data: {
      user: {
        id: userId,
        dungeonName: data.dungeonName,
      },
    },
  },
});

export const generateUpdateDungeonNameMock = (
  userId: string,
  newName: string,
  monsters: MonsterCardProps[]
): MockedResponse => ({
  request: {
    query: UPDATE_DUNGEON_NAME,
    variables: { userId, dungeonName: newName },
  },
  result: {
    data: {
      updateDungeonName: {
        id: userId,
        dungeonName: newName,
        favoritedMonsters: monsters,
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
        id: monsterId,
        reviews,
      },
    },
  },
});
