import { AuthContext } from '../context/AuthContext.tsx';
import { useContext, useState } from 'react';
import MonsterGraphQL from '../interfaces/MonsterDataProps.ts';
import { gql, Reference, useMutation, useQuery } from '@apollo/client';
import {
  ADD_FAVORITE_MONSTER,
  GET_USER_DUNGEON,
  GET_USER_FAVORITES,
  REMOVE_FAVORITE_MONSTER,
  UPDATE_DUNGEON_NAME,
} from '../graphql/queries.ts';
//https://www.apollographql.com/docs/react/caching/cache-interaction#using-cachemodify
const useDungeon = () => {
  const { userId } = useContext(AuthContext);
  const [dungeonMonsters, setDungeonMonsters] = useState<MonsterGraphQL[]>([]);
  const [dungeonName, setDungeonName] = useState('');

  const { refetch } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.user?.favoritedMonsters) {
        setDungeonMonsters(data.user.favoritedMonsters);
      }
    },
  });

  const { data: dungeonData, loading: dungeonLoad } = useQuery(GET_USER_DUNGEON, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.user?.dungeonName) {
        setDungeonName(data.user.dungeonName);
      }
    },
  });

  const [addFavoriteMonster] = useMutation(ADD_FAVORITE_MONSTER, {
    update(cache, { data }) {
      const newMonsterFromResponse = data?.addFavoriteMonster?.favoritedMonsters.id;
      const existingMonsters = cache.readQuery({
        query: GET_USER_FAVORITES,
        variables: { userId },
      });
      if (existingMonsters && newMonsterFromResponse) {
        cache.writeQuery({
          query: GET_USER_FAVORITES,
          data: {
            favoritedMonsters: [...existingMonsters?.favoritedMonsters, newMonsterFromResponse],
          },
        });
      }
      return { data };
    },
  });
  const [removeFavoriteMonster] = useMutation(REMOVE_FAVORITE_MONSTER, {
    refetchQueries: [{ query: GET_USER_FAVORITES, variables: { userId } }],
    awaitRefetchQueries: true,
    update(cache, { data: { removeFavoriteMonster } }) {
      const updatedFavoritedMonsters = removeFavoriteMonster?.favoritedMonsters;
      if (!updatedFavoritedMonsters) {
        console.error('No favorited monsters found in removeFavoriteMonster response');
        return;
      }
      cache.modify({
        id: cache.identify({ __typename: 'User', id: userId }),
        fields: {
          favoritedMonsters() {
            return updatedFavoritedMonsters.map((monster) =>
              cache.writeFragment({
                data: monster,
                fragment: gql`
                  fragment MonsterFragment on Monster {
                    id
                    name
                    size
                    type
                    alignment
                    hit_points
                    image
                  }
                `,
              })
            );
          },
        },
      });
      setDungeonMonsters(updatedFavoritedMonsters);
    },
    onError: (error) => {
      console.error('Error removing monster from dungeon', error);
    },
  });
  const [updateDungeonName] = useMutation(UPDATE_DUNGEON_NAME, {
    refetchQueries: [{ query: GET_USER_DUNGEON, variables: { userId } }],
    awaitRefetchQueries: true,
    update(cache, { data: { updateDungeonName } }) {
      const newName = updateDungeonName.dungeonName;
      cache.modify({
        id: cache.identify({ __typename: 'User', id: userId }),
        fields: {
          dungeonName() {
            return newName;
          },
        },
      });
      setDungeonName(newName);
    },
  });
  const toggleFavorite = async (monster: MonsterGraphQL) => {
    const isFavorite = dungeonMonsters.some((favMonster) => favMonster.id === monster.id);
    if (isFavorite) {
      await removeFavoriteMonster({
        variables: { userId, monsterId: monster.id },
        optimisticResponse: {
          removeFavoriteMonster: {
            __typename: 'RemoveFavoriteMonsterPayload',
            favoritedMonsters: dungeonMonsters.filter((currMonster) => currMonster.id !== monster.id),
          },
        },
      });
    } else {
      await addFavoriteMonster({
        variables: { userId, monsterId: monster.id },
        optimisticResponse: {
          addFavoriteMonster: {
            __typename: 'AddFavoriteMonsterPayload',
            favoritedMonsters: [...dungeonMonsters, monster],
          },
        },
      });
    }
  };

  const toggleDungeonName = async (newName: string) => {
    await updateDungeonName({ variables: { userId, dungeonName: newName } });
  };

  return {
    dungeonMonsters,
    dungeonName,
    toggleFavorite,
    refetchDungeonMonsters: refetch,
    toggleDungeonName,
  };
};

export default useDungeon;
