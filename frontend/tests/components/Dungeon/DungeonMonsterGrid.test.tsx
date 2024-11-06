import { render, screen } from '@testing-library/react';
import DungeonMonsterGrid from '../../../src/components/Dungeon/DungeonMonsterGrid.tsx';

import { GET_MONSTER_REVIEWS, GET_USER_DUNGEON } from '../../../../backend/src/graphql/queries.ts';
import { MockedProvider } from '@apollo/client/testing';
import { DungeonContext } from '../../../src/context/DungeonContext.tsx';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { expect } from 'vitest';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));
const mockMonsters = [
  { id: '1', name: 'Goblin', hp: 30, type: 'Beast', size: 'Small', img: '', alignment: 'neutral evil' },
  { id: '2', name: 'Orc', hp: 50, type: 'Humanoid', size: 'Medium', img: '', alignment: 'chaotic evil' },
  { id: '3', name: 'Dragon', hp: 200, type: 'Dragon', size: 'Huge', img: '', alignment: 'chaotic neutral' },
  { id: '4', name: 'Troll', hp: 120, type: 'Giant', size: 'Large', img: '', alignment: 'chaotic evil' },
  { id: '5', name: 'Vampire', hp: 150, type: 'Undead', size: 'Medium', img: '', alignment: 'lawful evil' },
  { id: '6', name: 'Giant Spider', hp: 75, type: 'Beast', size: 'Medium', img: '', alignment: 'neutral' },
];

const mocks = [
  {
    request: {
      query: GET_USER_DUNGEON,
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
              toggleDungeon: vi.fn(),
              isInDungeon: (monsterId) => monsterId !== '1',
            }}
          >
            <DungeonMonsterGrid />
          </DungeonContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });
  it('Renders 6 monstercards', async () => {
    const monsterNames = ['Goblin', 'Orc', 'Dragon', 'Troll', 'Vampire', 'Giant Spider'];
    for (const name of monsterNames) {
      const monsterElement = await screen.findByText(name); // Wait for each monster name
      expect(monsterElement).toBeInTheDocument();
    }
  });
  it('displays "No monsters in dungeon" when empty', () => {
    mockMonsters.length = 0;
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
          <DungeonContext.Provider
            value={{
              dungeonMonsters: mockMonsters,
              toggleDungeon: vi.fn(),
              isInDungeon: (monsterId) => monsterId !== '1',
            }}
          >
            <DungeonMonsterGrid />
          </DungeonContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
    expect(screen.getByText('No monsters in dungeon')).toBeInTheDocument();
  });
});
