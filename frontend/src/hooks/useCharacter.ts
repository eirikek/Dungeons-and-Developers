import { useContext } from 'react';
import { CharacterContext } from '../context/CharacterContext';

const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

export default useCharacter;
