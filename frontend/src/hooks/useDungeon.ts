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

export const useDungeon = () => {
  const { userId } = useContext(AuthContext);

  const { data: favoritesData, refetch: refetchFavorites } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: dungeonData } = useQuery(GET_USER_DUNGEON_NAME, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const initializeDungeonMonsters = (monsters: MonsterGraphQL[]) => {
    dungeonMonstersVar(monsters);
    localStorage.setItem('dungeonMonsters', JSON.stringify(monsters));
  };

  useEffect(() => {
    if (favoritesData?.user?.favoritedMonsters) {
      initializeDungeonMonsters(favoritesData.user.favoritedMonsters);
    }
  }, [favoritesData]);

  useEffect(() => {
    const storedMonsters = localStorage.getItem('dungeonMonsters');
    if (storedMonsters) {
      dungeonMonstersVar(JSON.parse(storedMonsters));
    }
  }, []);

  const dungeonName = dungeonData?.user?.dungeonName || null;

  const [addFavoriteMonster] = useMutation(ADD_FAVORITE_MONSTER, {
    onCompleted: () => refetchFavorites(),
  });

  const [removeFavoriteMonster] = useMutation(REMOVE_FAVORITE_MONSTER, {
    onCompleted: () => refetchFavorites(),
  });

  const [updateDungeonName] = useMutation(UPDATE_DUNGEON_NAME);

  const toggleFavorite = async (monster: MonsterCardProps) => {
    const currentFavorites = dungeonMonstersVar();
    const isFavorite = currentFavorites.some((favMonster) => favMonster.id === monster.id);

    try {
      if (isFavorite) {
        await removeFavoriteMonster({ variables: { userId, monsterId: monster.id } });
      } else {
        await addFavoriteMonster({ variables: { userId, monsterId: monster.id } });
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
