import { useContext } from 'react';
import { DungeonContext } from './DungeonContext.tsx';

export const useDungeonContext = () => {
  return useContext(DungeonContext);
};
