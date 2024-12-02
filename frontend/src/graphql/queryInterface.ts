import MonsterGraphQL from '../interfaces/MonsterDataProps.ts';

export interface UserFavorites {
  user: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

export interface UserFavoritesVars {
  userId: string;
}

export interface AddFavoriteResponse {
  addFavoriteMonster: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

export interface RemoveFavoriteResponse {
  removeFavoriteMonster: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

export interface UserClass {
  user: {
    id: string;
    class: {
      id: string;
      name: string;
      index: string;
      hit_die: number;
    };
  };
}

export interface UserRace {
  user: {
    id: string;
    race: {
      id: string;
      name: string;
      speed: number;
      alignment: string;
      size: string;
      img: string;
    };
  };
}

export interface UserAbilities {
  user: {
    id: string;
    abilityScores: {
      ability: {
        id: string;
        name: string;
      };
      score: number;
    };
  };
}

export interface Ability {
  id: string;
  name: string;
}

export interface AbilityScorePair {
  __typename: string;
  ability: Ability;
  score: number;
}

export interface ArrayScores {
  getArrayScores: AbilityScorePair[];
}

export type ArrayVar = {
  userId: string;
};

export interface GetUserEquipmentResponse {
  user: {
    id: string;
    equipments: Array<{
      id: string;
      index: number;
      name: string;
      category: string;
      value: number;
      __typename: string;
    }>;
  };
}
