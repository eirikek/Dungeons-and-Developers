import { render, screen } from '@testing-library/react';
import MonsterGrid from '../../../src/components/Dungeon/MonsterGrid.tsx';

import { MockedProvider } from '@apollo/client/testing';
import { expect } from 'vitest';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { DungeonContext } from '../../../src/context/DungeonContext.tsx';
import { GET_MONSTER_REVIEWS } from '../../../src/graphql/getMonsterQuerie.ts';
import { GET_USER_DUNGEON_NAME } from '../../../src/graphql/userQueries.ts';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));
const mockMonsters = [
  { id: '1', name: 'Goblin', hit_points: 30, type: 'Beast', size: 'Small', image: '', alignment: 'neutral evil' },
  { id: '2', name: 'Orc', hit_points: 50, type: 'Humanoid', size: 'Medium', image: '', alignment: 'chaotic evil' },
  { id: '3', name: 'Dragon', hit_points: 200, type: 'Dragon', size: 'Huge', image: '', alignment: 'chaotic neutral' },
  { id: '4', name: 'Troll', hit_points: 120, type: 'Giant', size: 'Large', image: '', alignment: 'chaotic evil' },
  { id: '5', name: 'Vampire', hit_points: 150, type: 'Undead', size: 'Medium', image: '', alignment: 'lawful evil' },
  { id: '6', name: 'Giant Spider', hit_points: 75, type: 'Beast', size: 'Medium', image: '', alignment: 'neutral' },
];

const mocks = [
  {
    request: {
      query: GET_USER_DUNGEON_NAME,
      variables: { userId: '1' },
    },
    result: {
      data: {
        user: {
          dungeonName: 'Example dungeon',
          favoritedMonsters: mockMonsters,
        },
      },
    },
  },
  ...mockMonsters.map((monster) => ({
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: monster.id },
    },
    result: {
      data: {
        monster: {
          reviews: [
            {
              id: `review-${monster.id}`,
              user: {
                id: 'user-1',
                userName: 'Alice',
              },
              difficulty: 4,
              description: `This ${monster.name} was tough!`,
              createdAt: '2024-11-06T08:00:00Z',
            },
          ],
        },
      },
    },
  })),
];

describe('DungeonMonsterGrid', () => {
  const userId = '1';
  const token = 'mock-token'; // Mock token
  const userName = 'Mock User'; // Mock user name
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
          <DungeonContext.Provider
            value={{
              dungeonMonsters: mockMonsters,
              dungeonName: '',
              updateDungeonName: vi.fn(),
              toggleDungeon: vi.fn(),
              isInDungeon: (monsterId) => monsterId !== '1',
            }}
          >
            <MonsterGrid />
          </DungeonContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });
  it.skip('Renders 6 monstercards', async () => {
    const monsterNames = ['Goblin', 'Orc', 'Dragon', 'Troll', 'Vampire', 'Giant Spider'];
    for (const name of monsterNames) {
      const monsterElement = await screen.findByText(name); // Wait for each monster name
      expect(monsterElement).toBeInTheDocument();
    }
  });
  it.skip('displays "No monsters in dungeon" when empty', () => {
    mockMonsters.length = 0;
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
          <DungeonContext.Provider
            value={{
              dungeonMonsters: mockMonsters,
              dungeonName: '',
              updateDungeonName: vi.fn(),
              toggleDungeon: vi.fn(),
              isInDungeon: (monsterId) => monsterId !== '1',
            }}
          >
            <MonsterGrid />
          </DungeonContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
    expect(screen.getByText('No monsters in dungeon')).toBeInTheDocument();
  });
});
