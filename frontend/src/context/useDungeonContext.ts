import { useContext } from 'react';
import { DungeonContext } from '../context/DungeonContextType';

export const useDungeonContext = () => {
  return useContext(DungeonContext);
};
