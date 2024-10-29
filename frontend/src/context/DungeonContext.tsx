import { ReactNode, useEffect, useRef, useState } from 'react';
import { MonsterCardDataProps } from '../hooks/useMonster';
import { DungeonContext, DungeonContextType } from './DungeonContextType';
import { useToast } from './useToast';

interface Action {
  monster: MonsterCardDataProps;
  action: 'add' | 'remove';
  timestamp: number;
}

export const DungeonProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();
  const initializeDungeon = () => {
    const savedDungeon = localStorage.getItem('dungeonMonsters');
    return savedDungeon ? JSON.parse(savedDungeon) : [];
  };

  const [dungeonMonsters, setDungeonMonsters] = useState<MonsterCardDataProps[]>(initializeDungeon);
  const actionsRef = useRef<Action[]>([]); // tracks all actions (undo etc) -> claude:When e.g. user clicks remove button (on monstercard) on two monsters fast. So that there are 2 toasts on screen. If user then clicks first toast (first monster removed) undo button, and then user clicks undo button on second toasts, then only first monster undo happens.

  useEffect(() => {
    localStorage.setItem('dungeonMonsters', JSON.stringify(dungeonMonsters));
  }, [dungeonMonsters]);

  const addAction = (action: Action) => {
    actionsRef.current = [action, ...actionsRef.current.slice(0, 4)]; // keep last 5 actions in array
  };

  const toggleDungeon = (monster: MonsterCardDataProps) => {
    setDungeonMonsters((prev) => {
      const isAlreadyInDungeon = prev.some((m) => m.index === monster.index);

      if (isAlreadyInDungeon) {
        const updatedMonsters = prev.filter((m) => m.index !== monster.index);
        addAction({ monster, action: 'remove', timestamp: Date.now() });

        showToast({
          message: `${monster.name} was removed from dungeon`,
          type: 'info',
          undoAction: () => handleUndo(monster),
        });

        return updatedMonsters;
      }
      if (prev.length === 6) {
        showToast({
          message: 'Only 6 monsters allowed in dungeon!',
          type: 'warning',
          duration: 2000,
        });
        return prev;
      }

      const updatedMonsters = [...prev, monster];
      addAction({ monster, action: 'add', timestamp: Date.now() });

      showToast({
        message: `${monster.name} was added to dungeon`,
        type: 'info',
        undoAction: () => handleUndo(monster),
      });

      return updatedMonsters;
    });
  };

  const handleUndo = (monster: MonsterCardDataProps) => {
    const actionIndex = actionsRef.current.findIndex((action) => action.monster.index === monster.index);
    if (actionIndex !== -1) {
      const { action } = actionsRef.current[actionIndex];

      setDungeonMonsters((prev) => {
        if (action === 'remove') {
          return [...prev, monster];
        } else {
          return prev.filter((m) => m.index !== monster.index);
        }
      });
      actionsRef.current = actionsRef.current.filter((_, index) => index !== actionIndex);
      const undoMessage =
        action === 'remove'
          ? `${monster.name} has been restored to the dungeon`
          : `Canceled adding ${monster.name} to dungeon `;

      showToast({
        message: undoMessage,
        type: 'success',
        duration: 3000,
      });
    }
  };
  const isInDungeon = (monsterIndex: string) => {
    return dungeonMonsters.some((monster) => monster.index === monsterIndex);
  };

  return (
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon } as DungeonContextType}>
      {children}
    </DungeonContext.Provider>
  );
};
