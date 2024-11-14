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
} from '../../../backend/src/graphql/queries.ts';
//https://www.apollographql.com/docs/react/caching/cache-interaction#using-cachemodify
const useDungeonMonsters = () => {
  const { userId } = useContext(AuthContext);
  const [dungeonMonsters, setDungeonMonsters] = useState<MonsterGraphQL[]>([]);
  const [dungeonName, setDungeonName] = useState('My dungeon');
  const { refetch } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      if (data?.user?.favoritedMonsters) {
        setDungeonMonsters(data.user.favoritedMonsters);
      }
    },
  });

  useQuery(GET_USER_DUNGEON, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      if (data?.user?.dungeonName) {
        setDungeonName(data.user.dungeonName);
      }
    },
  });

  const [addFavoriteMonster] = useMutation(ADD_FAVORITE_MONSTER, {
    update(cache, { data: { addFavoriteMonster } }) {
      const newMonster = addFavoriteMonster.favoritedMonsters[0];

      cache.modify({
        id: cache.identify({ __typename: 'User', id: userId }),
        fields: {
          favoritedMonsters(existingMonsters = [], { readField }) {
            const newMonsterRef = cache.writeFragment({
              data: newMonster,
              fragment: gql`
                fragment NewMonster on Monster {
                  id
                  name
                  size
                  type
                  alignment
                  hit_points
                  image
                }
              `,
            });
            if (existingMonsters.some((ref: Reference) => readField('id', ref) === newMonster.id)) {
              return existingMonsters;
            }
            return [...existingMonsters, newMonsterRef];
          },
        },
      });
    },
    onError: (error) => {
      console.error('Error adding monster to dungeon', error);
    },
  });
  const [removeFavoriteMonster] = useMutation(REMOVE_FAVORITE_MONSTER, {
    update(cache, { data: { removeFavoriteMonster } }) {
      const monsterToRemove = removeFavoriteMonster.favoritedMonsters[0].id;
      cache.modify({
        id: cache.identify({ __typename: 'User', id: userId }),
        fields: {
          favoritedMonsters(existingMonsters = [], { readField }) {
            return existingMonsters.filter((monsterRef: Reference) => readField('id', monsterRef) !== monsterToRemove);
          },
        },
      });
    },
    onError: (error) => {
      console.error('Error removing monster from dungeon', error);
    },
  });
  const [updateDungeonName] = useMutation(UPDATE_DUNGEON_NAME, {
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
    },
  });
  const toggleFavorite = async (monster: MonsterGraphQL) => {
    const isFavorite = dungeonMonsters.some((favMonster) => favMonster.id === monster.id);
    if (isFavorite) {
      await removeFavoriteMonster({ variables: { userId, monsterId: monster.id } });
    } else {
      await addFavoriteMonster({ variables: { userId, monsterId: monster.id } });
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

export default useDungeonMonsters;
