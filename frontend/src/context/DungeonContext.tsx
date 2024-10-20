import { createContext, useState, useEffect, ReactNode, useRef } from 'react';
import { MonsterCardDataProps } from '../hooks/useMonster';
import { toast } from 'react-toastify';

interface DungeonContextType {
  dungeonMonsters: MonsterCardDataProps[];
  toggleDungeon: (monster: MonsterCardDataProps) => void;
  isInDungeon: (monsterIndex: string) => boolean;
}
interface Action {
  monster: MonsterCardDataProps;
  action: 'add' | 'remove';
  timestamp: number;
}

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  toggleDungeon: () => {},
  isInDungeon: () => false,
});

export const DungeonProvider = ({ children }: { children: ReactNode }) => {
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

      let updatedMonsters;

      if (isAlreadyInDungeon) {
        updatedMonsters = prev.filter((m) => m.index !== monster.index);
        addAction({ monster, action: 'remove', timestamp: Date.now() });
      } else if (prev.length < 6) {
        updatedMonsters = [...prev, monster];
        addAction({ monster, action: 'add', timestamp: Date.now() });
      } else {
        updatedMonsters = prev;
      }
      const actionMessage = isAlreadyInDungeon
        ? `${monster.name} was removed from dungeon`
        : `${monster.name} was added to dungeon`;

      showToast(actionMessage, monster);

      return updatedMonsters;
    });
  };

  const showToast = (actionMessage: string, monster: MonsterCardDataProps) => {
    toast.info(
      <>
        <p>{actionMessage}</p>
        <button
          onClick={() => handleUndo(monster)}
          className="bg-blue-400 text-white px-3 py-1 rounded-md hover:bg-blue-800 transition duration-200 ease-in-out mt-8"
        >
          Undo
        </button>
      </>,
      {
        position: 'top-center',
        autoClose: 3000,
      }
    );
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
      toast.success(undoMessage, {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };
  const isInDungeon = (monsterIndex: string) => {
    return dungeonMonsters.some((monster) => monster.index === monsterIndex);
  };

  return (
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};
