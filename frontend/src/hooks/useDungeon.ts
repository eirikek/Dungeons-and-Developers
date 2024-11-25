import { useMutation, useQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

import { dungeonMonstersVar } from '../context/DungeonContext';
import {
  ADD_FAVORITE_MONSTER,
  REMOVE_FAVORITE_MONSTER,
  UPDATE_DUNGEON_NAME,
} from '../graphql/mutations/userMutations.ts';
import { GET_USER_DUNGEON_NAME, GET_USER_FAVORITES } from '../graphql/queries/userQueries.ts';
import type { MonsterCardProps } from '../interfaces/MonsterCardProps';
import type MonsterGraphQL from '../interfaces/MonsterDataProps';

interface UserFavorites {
  user: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

interface UserFavoritesVars {
  userId: string;
}

interface AddFavoriteResponse {
  addFavoriteMonster: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

interface RemoveFavoriteResponse {
  removeFavoriteMonster: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

export const useDungeon = () => {
  const { userId } = useContext(AuthContext);

  const { data: favoritesData } = useQuery<UserFavorites, UserFavoritesVars>(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: dungeonData } = useQuery(GET_USER_DUNGEON_NAME, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (favoritesData?.user?.favoritedMonsters) {
      dungeonMonstersVar(favoritesData.user.favoritedMonsters);
    }
  }, [favoritesData]);

  const dungeonName = dungeonData?.user?.dungeonName || null;

  const [addFavoriteMonster] = useMutation<AddFavoriteResponse>(ADD_FAVORITE_MONSTER, {
    update(cache, { data }) {
      if (!data) return;

      const existing = cache.readQuery<UserFavorites>({
        query: GET_USER_FAVORITES,
        variables: { userId },
      });

      if (existing?.user) {
        cache.writeQuery<UserFavorites>({
          query: GET_USER_FAVORITES,
          variables: { userId },
          data: {
            user: {
              ...existing.user,
              favoritedMonsters: data.addFavoriteMonster.favoritedMonsters,
            },
          },
        });
      }
    },
  });

  const [removeFavoriteMonster] = useMutation<RemoveFavoriteResponse>(REMOVE_FAVORITE_MONSTER, {
    update(cache, { data }) {
      if (!data) return;

      const existing = cache.readQuery<UserFavorites>({
        query: GET_USER_FAVORITES,
        variables: { userId },
      });

      if (existing?.user) {
        cache.writeQuery<UserFavorites>({
          query: GET_USER_FAVORITES,
          variables: { userId },
          data: {
            user: {
              ...existing.user,
              favoritedMonsters: data.removeFavoriteMonster.favoritedMonsters,
            },
          },
        });
      }
    },
  });

  const [updateDungeonName] = useMutation(UPDATE_DUNGEON_NAME);

  const toggleFavorite = async (monster: MonsterCardProps) => {
    const currentFavorites = dungeonMonstersVar();
    const isFavorite = currentFavorites.some((favMonster) => favMonster.id === monster.id);

    try {
      if (isFavorite) {
        const response = await removeFavoriteMonster({
          variables: { userId, monsterId: monster.id },
        });
        if (response.data?.removeFavoriteMonster.favoritedMonsters) {
          dungeonMonstersVar(response.data.removeFavoriteMonster.favoritedMonsters);
        }
      } else {
        const response = await addFavoriteMonster({
          variables: { userId, monsterId: monster.id },
        });
        if (response.data?.addFavoriteMonster.favoritedMonsters) {
          dungeonMonstersVar(response.data.addFavoriteMonster.favoritedMonsters);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const toggleDungeonName = async (newName: string) => {
    try {
      await updateDungeonName({
        variables: { userId, dungeonName: newName },
        optimisticResponse: {
          updateDungeonName: {
            __typename: 'User',
            id: userId,
            dungeonName: newName,
          },
        },
      });
    } catch (error) {
      console.error('Error updating dungeon name:', error);
    }
  };

  return {
    dungeonMonsters: dungeonMonstersVar(),
    dungeonName,
    toggleFavorite,
    toggleDungeonName,
  };
};

export default useDungeon;
