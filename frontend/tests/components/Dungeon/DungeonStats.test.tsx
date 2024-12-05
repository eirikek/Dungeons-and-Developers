import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DungeonContext } from '../../../src/context/DungeonProvider.tsx';
import DungeonStats from '../../../src/components/Dungeon/DungeonStats.tsx';
import { MonsterCardProps } from '../../../src/interfaces/MonsterCardProps.ts'; // Adjust path as needed

describe('DungeonStats', () => {
  it('renders the correct total HP for dungeon monsters', () => {
    const mockDungeonMonsters: MonsterCardProps[] = [
      {
        id: '1',
        name: 'Goblin',
        type: 'Humanoid',
        hit_points: 30,
        alignment: 'Chaotic Evil',
        size: 'Small',
        image: 'goblin.png',
      },
      {
        id: '2',
        name: 'Orc',
        type: 'Humanoid',
        hit_points: 45,
        alignment: 'Chaotic Neutral',
        size: 'Medium',
        image: 'orc.png',
      },
      {
        id: '3',
        name: 'Dragon',
        type: 'Dragon',
        hit_points: 120,
        alignment: 'Lawful Good',
        size: 'Large',
        image: 'dragon.png',
      },
    ];

    const mockToggleDungeon = vi.fn<(monster: MonsterCardProps) => void>();
    const mockIsInDungeon = vi.fn<(monsterId: string) => boolean>();

    render(
      <DungeonContext.Provider
        value={{
          dungeonMonsters: mockDungeonMonsters,
          toggleDungeon: mockToggleDungeon,
          isInDungeon: mockIsInDungeon,
        }}
      >
        <DungeonStats />
      </DungeonContext.Provider>
    );

    const totalHp = mockDungeonMonsters.reduce((sum, monster) => sum + monster.hit_points, 0);

    const totalHpElement = screen.getByLabelText('Total Dungeon HP');
    expect(totalHpElement).toBeInTheDocument();
    expect(totalHpElement).toHaveTextContent(`Total Dungeon HP: ${totalHp}`);
  });

  it('does not render the header when no monsters are in the dungeon', () => {
    const mockToggleDungeon = vi.fn<(monster: MonsterCardProps) => void>();
    const mockIsInDungeon = vi.fn<(monsterId: string) => boolean>();

    render(
      <DungeonContext.Provider
        value={{
          dungeonMonsters: [],
          toggleDungeon: mockToggleDungeon,
          isInDungeon: mockIsInDungeon,
        }}
      >
        <DungeonStats />
      </DungeonContext.Provider>
    );

    // Check that the header is not rendered
    const totalHpElement = screen.queryByLabelText('Total Dungeon HP');
    expect(totalHpElement).not.toBeInTheDocument();
  });
});
