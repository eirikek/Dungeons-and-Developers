import { useMutation, useQuery } from '@apollo/client';
import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import {
  ADD_FAVORITE_MONSTER,
  GET_USER_DUNGEON,
  GET_USER_FAVORITES,
  REMOVE_FAVORITE_MONSTER,
  UPDATE_DUNGEON_NAME,
} from '../graphql/queries.ts';
import MonsterGraphQL from '../interfaces/MonsterDataProps.ts';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';

const useDungeon = () => {
  const { userId } = useContext(AuthContext);
  const [dungeonName, setDungeonName] = useState('');

  const {
    data: dataMonsters,
    loading,
    error,
    refetch,
  } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      console.log('Favorites query completed:', data);
      console.log('Favorited monsters:', data?.user?.favoritedMonsters);
    },
    onError: (error) => {
      console.error('Favorites query error:', error);
    },
  });
  const dungeonMonsters: MonsterGraphQL[] = useMemo(() => {
    console.log('Processing dungeonMonsters:', dataMonsters?.user?.favoritedMonsters);
    return dataMonsters?.user?.favoritedMonsters || [];
  }, [dataMonsters]);

  useQuery(GET_USER_DUNGEON, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.user?.dungeonName) {
        setDungeonName(data.user.dungeonName);
      }
    },
  });

  const [addFavoriteMonster] = useMutation(ADD_FAVORITE_MONSTER);
  const [removeFavoriteMonster] = useMutation(REMOVE_FAVORITE_MONSTER);

  const [updateDungeonName] = useMutation(UPDATE_DUNGEON_NAME);

  const toggleFavorite = async (monster: MonsterCardProps, isUndo: boolean) => {
    const isFavorite = dungeonMonsters.some((favMonster) => favMonster.id === monster.id);

    try {
      if (isFavorite && !isUndo) {
        const result = await removeFavoriteMonster({
          variables: { userId, monsterId: monster.id },
        });
        console.log('Remove result:', result);
      } else if (!isFavorite) {
        const result = await addFavoriteMonster({
          variables: { userId, monsterId: monster.id },
        });
        console.log('Add result:', result);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      refetch();
    }
  };

  const toggleDungeonName = async (newName: string) => {
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
  };

  return {
    dungeonMonsters,
    dungeonName,
    toggleFavorite,
    refetchDungeonMonsters: refetch,
    toggleDungeonName,
    loading,
    error,
  };
};

export default useDungeon;
