import { render, screen } from '@testing-library/react';
import DungeonMonsterGrid from '../../../src/components/Dungeon/DungeonMonsterGrid.tsx';
import { DungeonContextType } from '../../../src/context/DungeonContext.tsx';
import React from 'react';
import userEvent from '@testing-library/user-event';

const mockDungeonContextValue: DungeonContextType = {
  dungeonMonsters: [
    { id: '1', name: 'Goblin', hp: 7, type: 'humanoid', alignment: 'neutral evil', size: 'Small' },
    { id: '2', name: 'Skeleton', hp: 75, type: 'undead', alignment: 'lawful evil', size: 'Medium' },
    { id: '3', name: 'Minotaur', hp: 100, type: 'monstrosity', alignment: 'chaotic evil', size: 'Large' },
  ],
  toggleDungeon: vi.fn(),
  isInDungeon: vi.fn().mockReturnValue(false),
};
vi.mock('react', async () => {
  const actualReact = await vi.importActual<typeof React>('react');
  return {
    ...actualReact,
    useContext: () => mockDungeonContextValue,
  };
});
describe('DungeonMonsterGrid', () => {
  it('Renders 3 monstercards', () => {
    render(<DungeonMonsterGrid />);
    expect(screen.getAllByTestId('monster-card')).toHaveLength(3);
  });
  it('displays "No monsters in dungeon" when empty', () => {
    mockDungeonContextValue.dungeonMonsters = [];
    render(<DungeonMonsterGrid />);
    expect(screen.getByText('No monsters in dungeon')).toBeInTheDocument();
  });

  it('should call toggledungeon on click', async () => {
    const user = userEvent.setup();
    render(<DungeonMonsterGrid />);

    const button = screen.getAllByRole('button', { name: 'Click to add to dungeon' })[0];

    await user.click(button);

    expect(mockDungeonContextValue.toggleDungeon).toHaveBeenCalled();
  });
});
