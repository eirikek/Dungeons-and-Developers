import { useMutation, useQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

import {
  ADD_FAVORITE_MONSTER,
  REMOVE_FAVORITE_MONSTER,
  UPDATE_DUNGEON_NAME,
} from '../graphql/mutations/userMutations.ts';
import { GET_USER_DUNGEON_NAME, GET_USER_FAVORITES } from '../graphql/queries/userQueries.ts';
import { AddFavoriteResponse, RemoveFavoriteResponse, UserFavorites } from '../graphql/queryInterface.ts';
import type { MonsterCardProps } from '../interfaces/MonsterCardProps';
import { dungeonMonstersVar } from '../utils/apolloVars.ts';

/**
 * Custom Hook: `useDungeon`
 *
 * Manages the state and interactions related to the dungeon and user's favorited monsters.
 *
 * Features:
 * - Fetches and manages the user's favorited monsters and dungeon name.
 * - Allows adding/removing monsters to/from the dungeon.
 * - Updates the dungeon's name with optimistic UI updates.
 * - Uses Apollo Client for GraphQL queries and mutations.
 *
 * Dependencies:
 * - Requires `AuthContext` to provide the `userId`.
 * - Utilizes `dungeonMonstersVar` for local state management.
 *
 * @returns An object containing:
 * - `dungeonMonsters`: The current list of favorited monsters.
 * - `toggleFavorite`: A function to add or remove a monster from favorites.
 * - `toggleDungeonName`: A function to update the dungeon name.
 * - `favoritesError`: Any error that occurred while fetching the user's favorites.
 * - `userId`: The ID of the logged-in user.
 *
 * @example
 * ```tsx
 * const { dungeonMonsters, toggleFavorite, toggleDungeonName, favoritesError } = useDungeon();
 *
 * if (favoritesError) {
 *   console.error('Error fetching favorites:', favoritesError);
 * }
 *
 * toggleFavorite(monster);
 * toggleDungeonName('My New Dungeon Name');
 * ```
 */

export const useDungeon = () => {
  const { userId } = useContext(AuthContext);

  const { data: favoritesData, error: favoritesError } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only', // Add this
    notifyOnNetworkStatusChange: false, // Add this
  });

  useEffect(() => {
    if (favoritesData?.user?.favoritedMonsters) {
      dungeonMonstersVar(favoritesData.user.favoritedMonsters);
    }
  }, [favoritesData]);

  const [addFavoriteMonster] = useMutation<AddFavoriteResponse>(ADD_FAVORITE_MONSTER, {
    update(cache, { data }) {
      if (!data) return;

      const existing = cache.readQuery<UserFavorites>({
        query: GET_USER_FAVORITES,
        variables: { userId },
      });

      if (existing?.user) {
        const newFavorites = data.addFavoriteMonster.favoritedMonsters;
        cache.writeQuery<UserFavorites>({
          query: GET_USER_FAVORITES,
          variables: { userId },
          data: {
            user: {
              ...existing.user,
              favoritedMonsters: newFavorites,
            },
          },
        });
        dungeonMonstersVar(newFavorites);
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
        const newFavorites = data.removeFavoriteMonster.favoritedMonsters;
        cache.writeQuery<UserFavorites>({
          query: GET_USER_FAVORITES,
          variables: { userId },
          data: {
            user: {
              ...existing.user,
              favoritedMonsters: newFavorites,
            },
          },
        });
        dungeonMonstersVar(newFavorites);
      }
    },
  });

  const [updateDungeonName] = useMutation(UPDATE_DUNGEON_NAME);

  const toggleFavorite = async (monster: MonsterCardProps) => {
    const currentFavorites = dungeonMonstersVar();
    const isFavorite = currentFavorites.some((favMonster) => favMonster.id === monster.id);

    try {
      if (isFavorite) {
        await removeFavoriteMonster({
          variables: { userId, monsterId: monster.id },
        });
      } else {
        await addFavoriteMonster({
          variables: { userId, monsterId: monster.id },
        });
      }
    } catch (error) {
      console.error('Could not add monster', error);
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
        update(cache, { data }) {
          if (!data) return;

          cache.writeQuery({
            query: GET_USER_DUNGEON_NAME,
            variables: { userId },
            data: {
              user: {
                id: userId,
                dungeonName: newName,
                __typename: 'User',
              },
            },
          });
        },
      });
    } catch (error) {
      console.error('Error updating dungeon name:', error);
    }
  };

  return {
    dungeonMonsters: dungeonMonstersVar(),
    toggleFavorite,
    toggleDungeonName,
    favoritesError,
    userId,
  };
};

export default useDungeon;
