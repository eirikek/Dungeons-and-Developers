import { render, screen } from '@testing-library/react';
import MonsterGrid from '../../../src/components/Dungeon/MonsterGrid';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { expect } from 'vitest';
import { AuthContext } from '../../../src/context/AuthContext';
import { DungeonContext } from '../../../src/context/DungeonContext';
import { GET_MONSTER_REVIEWS } from '../../../src/graphql/queries/monsterQueries';
import { GET_USER_DUNGEON_NAME } from '../../../src/graphql/queries/userQueries';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));
const mockMonsters = [
  {
    alignment: 'neutral evil',
    hit_points: 30,
    id: '1',
    image: '',
    name: 'Goblin',
    size: 'Small',
    type: 'Beast',
  },
  {
    alignment: 'chaotic evil',
    hit_points: 50,
    id: '2',
    image: '',
    name: 'Orc',
    size: 'Medium',
    type: 'Humanoid',
  },
  {
    alignment: 'chaotic neutral',
    id: '3',
    hit_points: 200,
    image: '',
    name: 'Dragon',
    size: 'Huge',
    type: 'Dragon',
  },
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
          id: monster.id,
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
  const token = 'mock-token';
  const userName = 'Mock User';

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
              isInDungeon: (monsterId) => monsterId !== '123',
            }}
          >
            <MonsterGrid />
          </DungeonContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });

  it('Renders 3 monster cards', async () => {
    const monsterNames = ['Goblin', 'Orc', 'Dragon'];

    for (const name of monsterNames) {
      await screen.findByText(name);
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('displays "No monsters in dungeon" when empty', () => {
    const emptyMonsters = [];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
          <DungeonContext.Provider
            value={{
              dungeonMonsters: emptyMonsters,
              dungeonName: '',
              updateDungeonName: vi.fn(),
              toggleDungeon: vi.fn(),
              isInDungeon: (monsterId) => monsterId !== '123',
            }}
          >
            <MonsterGrid />
          </DungeonContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );

    expect(screen.getByText('No monsters found')).toBeInTheDocument();
  });
});
