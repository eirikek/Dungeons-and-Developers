/*
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { MonsterCardProps } from '../../../src/interfaces/MonsterCardProps.ts';
import MonsterPage from '../../../src/pages/mainPages/monsterPage.tsx';
import DungeonContextMock from '../../mocks/DungeonContextMock';
import { GET_MONSTER_REVIEWS, GET_MONSTERS } from '../../../src/graphql/getMonsterQuerie.ts';
import { GET_USER_FAVORITES } from '../../../src/graphql/userQueries.ts';
import { ADD_FAVORITE_MONSTER, REMOVE_FAVORITE_MONSTER } from '../../../src/graphql/favouriteMonsterQueries.ts'; // Adjust the path as necessary

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const monstersPerPage = 8;

const initialMonsters: MonsterCardProps[] = [
  {
    id: '1',
    name: 'Goblin',
    type: 'humanoid',
    hit_points: 7,
    alignment: 'neutral evil',
    size: 'small',
    image: 'goblin.jpg',
  },
  {
    id: '2',
    name: 'Orc',
    type: 'humanoid',
    hit_points: 15,
    alignment: 'chaotic evil',
    size: 'medium',
    image: 'orc.jpg',
  },
];

const generateMonsterReviewsMocks = (monsters: MonsterCardProps[]): MockedResponse[] => {
  return monsters.map((monster) => ({
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
                id: `user-${monster.id}`,
                userName: `User${monster.id}`,
              },
              difficulty: 3,
              description: `Review for ${monster.name}.`,
              createdAt: '2024-11-01T00:00:00Z',
            },
          ],
        },
      },
    },
  }));
};

const generateUserFavoritesMocks = (userId: string, favoritedMonsters: MonsterCardProps[]): MockedResponse[] => [
  {
    request: {
      query: GET_USER_FAVORITES,
      variables: { userId },
    },
    result: {
      data: {
        user: {
          userId,
          favoritedMonsters,
        },
      },
    },
  },
];

const generateMonstersMocks = (monsters: MonsterCardProps[]): MockedResponse[] => [
  {
    request: {
      query: GET_MONSTERS,
      variables: {
        searchTerm: '',
        offset: 0,
        limit: monstersPerPage,
        types: [],
      },
    },
    result: {
      data: {
        monsters: {
          monsters,
          totalMonsters: monsters.length,
        },
      },
    },
  },
];

const generateAddFavoriteMonsterMock = (userId: string, monster: MonsterCardProps): MockedResponse => ({
  request: {
    query: ADD_FAVORITE_MONSTER,
    variables: { userId, monsterId: monster.id },
  },
  result: {
    data: {
      addFavoriteMonster: {
        favoritedMonsters: [monster],
      },
    },
  },
});

const generateRemoveFavoriteMonsterMock = (userId: string, monster: MonsterCardProps): MockedResponse => ({
  request: {
    query: REMOVE_FAVORITE_MONSTER,
    variables: { userId, monsterId: monster.id },
  },
  result: {
    data: {
      removeFavoriteMonster: {
        favoritedMonsters: [],
      },
    },
  },
});

// Consolidated Render Function
//const renderComponent = (mocks: MockedResponse[], allMonsters: MonsterCardProps[], initialDungeon: string[] = []) =>
//  render(
//    <MemoryRouter initialEntries={['/monsters']}>
//      <MockedProvider mocks={mocks} addTypename={false}>
//        <AuthContext.Provider
//          value={{
//            userId: '1',
//            token: 'mock-token',
//            userName: 'Mock User',
//            login: vi.fn(),
//            logout: vi.fn(),
//          }}
//        >
//          <DungeonContextMock initialDungeon={initialDungeon} allMonsters={allMonsters}>
//            <MonsterPage />
//          </DungeonContextMock>
//        </AuthContext.Provider>
//      </MockedProvider>
//    </MemoryRouter>
//  );

describe.skip('MonsterPage', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.skip('renders loading state initially', () => {
    const loadingMocks: MockedResponse[] = [
      {
        request: {
          query: GET_MONSTERS,
          variables: {
            searchTerm: '',
            offset: 0,
            limit: monstersPerPage,
            types: [],
          },
        },
        result: {
          data: {
            monsters: {
              monsters: [],
              totalMonsters: 0,
            },
          },
        },
      },
      ...generateUserFavoritesMocks('1', []),
    ];

    renderComponent(loadingMocks, initialMonsters, []);

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it.skip('renders monsters after loading', async () => {
    const mocks: MockedResponse[] = [
      ...generateMonstersMocks(initialMonsters),
      ...generateUserFavoritesMocks('1', []),
      ...generateMonsterReviewsMocks(initialMonsters),
    ];

    renderComponent(mocks, initialMonsters, []);

    for (const monster of initialMonsters) {
      await waitFor(() => expect(screen.getByText(monster.name)).toBeInTheDocument());
    }

    const monsterCards = await screen.findAllByTestId(/-monster-card$/);
    expect(monsterCards.length).toBe(initialMonsters.length);
  });

  it.skip('displays error message on error', async () => {
    const errorMocks: MockedResponse[] = [
      {
        request: {
          query: GET_MONSTERS,
          variables: {
            searchTerm: '',
            offset: 0,
            limit: monstersPerPage,
            types: [],
          },
        },
        error: new GraphQLError('An error occurred'),
      },
      ...generateUserFavoritesMocks('1', []),
    ];

    renderComponent(errorMocks, initialMonsters, []);

    await waitFor(() => {
      expect(screen.getByText('An error occurred while loading monsters.')).toBeInTheDocument();
    });
  });

  it.skip('updates monsters when search term is entered', async () => {
    const searchTerm = 'Dragon';
    const dragonMonster: MonsterCardProps = {
      id: '3',
      name: 'Dragon',
      type: 'dragon',
      hit_points: 200,
      alignment: 'chaotic evil',
      size: 'large',
      image: 'dragon.jpg',
    };

    const searchMocks: MockedResponse[] = [
      ...generateMonstersMocks([...initialMonsters, dragonMonster]),
      ...generateUserFavoritesMocks('1', []),
      ...generateMonsterReviewsMocks([...initialMonsters, dragonMonster]),
      {
        request: {
          query: GET_MONSTERS,
          variables: {
            searchTerm,
            offset: 0,
            limit: monstersPerPage,
            types: [],
          },
        },
        result: {
          data: {
            monsters: {
              monsters: [dragonMonster],
              totalMonsters: 1,
            },
          },
        },
      },
      {
        request: {
          query: GET_MONSTER_REVIEWS,
          variables: { monsterId: '3' },
        },
        result: {
          data: {
            monster: {
              reviews: [
                {
                  id: 'review-3',
                  user: {
                    id: 'user-3',
                    userName: 'Charlie',
                  },
                  difficulty: 4,
                  description: 'This monster was tough!',
                  createdAt: '2024-11-06T08:00:00Z',
                },
              ],
            },
          },
        },
      },
    ];

    renderComponent(searchMocks, [...initialMonsters, dragonMonster], []);

    for (const monster of initialMonsters) {
      await waitFor(() => expect(screen.getByText(monster.name)).toBeInTheDocument());
    }

    const searchInput = screen.getByPlaceholderText('Search for a monster...');
    await userEvent.type(searchInput, searchTerm);

    // Simulate debounce or delay
    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));

    await waitFor(() => expect(screen.getByText('Dragon')).toBeInTheDocument());

    expect(screen.queryByText('Goblin')).not.toBeInTheDocument();
  });

  it.skip('displays "No monsters found" when there are no results', async () => {
    const searchTerm = 'NonExistentMonster';
    const noResultsMocks: MockedResponse[] = [
      ...generateMonstersMocks(initialMonsters),
      ...generateUserFavoritesMocks('1', []),
      ...generateMonsterReviewsMocks(initialMonsters),
      {
        request: {
          query: GET_MONSTERS,
          variables: {
            searchTerm,
            offset: 0,
            limit: monstersPerPage,
            types: [],
          },
        },
        result: {
          data: {
            monsters: {
              monsters: [],
              totalMonsters: 0,
            },
          },
        },
      },
    ];

    renderComponent(noResultsMocks, initialMonsters, []);

    for (const monster of initialMonsters) {
      await waitFor(() => expect(screen.getByText(monster.name)).toBeInTheDocument());
    }

    const searchInput = screen.getByPlaceholderText('Search for a monster...');
    await userEvent.type(searchInput, searchTerm);

    // Simulate debounce or delay
    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));

    await waitFor(() => expect(screen.getByText('No monsters found')).toBeInTheDocument());

    for (const monster of initialMonsters) {
      expect(screen.queryByText(monster.name)).not.toBeInTheDocument();
    }
  });

  it.skip('adds a monster to the dungeon', async () => {
    const addMocks: MockedResponse[] = [
      ...generateUserFavoritesMocks('1', []),
      ...generateMonstersMocks(initialMonsters),
      generateAddFavoriteMonsterMock('1', initialMonsters[1]),
      ...generateUserFavoritesMocks('1', [initialMonsters[1]]),
      ...generateMonsterReviewsMocks(initialMonsters),
    ];

    renderComponent(addMocks, initialMonsters, []);

    const orcCard = await screen.findByTestId('Orc-monster-card');
    expect(orcCard).toBeInTheDocument();

    const addButton = within(orcCard).getByText('Add to dungeon');
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Orc added to dungeon',
          type: 'success',
          duration: 3000,
        })
      );
    });
  });

  it.skip('removes a monster from the dungeon', async () => {
    const removeMocks: MockedResponse[] = [
      ...generateMonstersMocks(initialMonsters),
      ...generateUserFavoritesMocks('1', [initialMonsters[1]]),
      generateRemoveFavoriteMonsterMock('1', initialMonsters[1]),
      ...generateUserFavoritesMocks('1', []),
      ...generateMonsterReviewsMocks(initialMonsters),
    ];

    renderComponent(removeMocks, initialMonsters, [initialMonsters[1].id]);

    await waitFor(() => {
      expect(screen.getByText('Orc')).toBeInTheDocument();
    });

    const orcCard = screen.getByTestId('Orc-monster-card');
    expect(orcCard).toBeInTheDocument();

    const removeButton = await within(orcCard).findByText('Remove from dungeon');
    expect(removeButton).toBeInTheDocument();

    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Orc removed from dungeon',
          type: 'info',
          undoAction: expect.any(Function),
          duration: 5000,
        })
      );

      expect(within(orcCard).getByText('Add to dungeon')).toBeInTheDocument();

      expect(within(orcCard).queryByText('Remove from dungeon')).not.toBeInTheDocument();
    });
  });
  it.skip('removes a monster and shows an undo option', async () => {
    const mocks: MockedResponse[] = [
      ...generateMonstersMocks(initialMonsters),
      ...generateUserFavoritesMocks('1', initialMonsters),
    ];

    renderComponent(mocks, initialMonsters, ['1', '2']); // Initial dungeon has both monsters

    const goblinCard = await waitFor(() => screen.getByTestId('Goblin-monster-card'));
    const removeButton = within(goblinCard).getByText('Remove from dungeon');
    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Goblin removed from dungeon',
        type: 'info',
        undoAction: expect.any(Function),
        duration: 5000,
      });
    });
  });

  it.skip('shows warning when adding a monster at max capacity', async () => {
    const sixMonsters: MonsterCardProps[] = Array.from({ length: 6 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Monster${i + 1}`,
      hit_points: 10,
      type: 'Beast',
      size: 'Medium',
      image: `monster${i + 1}.jpg`,
      alignment: 'neutral evil',
    }));
    const seventhMonster: MonsterCardProps = {
      id: '7',
      name: 'Monster7',
      hit_points: 12,
      type: 'Beast',
      size: 'Large',
      image: 'monster7.jpg',
      alignment: 'chaotic evil',
    };

    const maxMocks: MockedResponse[] = [
      ...generateMonstersMocks([...sixMonsters, seventhMonster]),
      ...generateUserFavoritesMocks('1', sixMonsters),
      ...generateMonsterReviewsMocks([...sixMonsters, seventhMonster]),
    ];

    renderComponent(
      maxMocks,
      [...sixMonsters, seventhMonster],
      sixMonsters.map((monster) => monster.id)
    );

    for (const monster of [...sixMonsters, seventhMonster]) {
      await waitFor(() => expect(screen.getByText(monster.name)).toBeInTheDocument());
    }

    const monsterCard = screen.getByTestId('Monster7-monster-card');
    expect(monsterCard).toBeInTheDocument();

    const addButtons = await within(monsterCard).findAllByRole('button', { name: 'Add to dungeon' });
    const addButton = addButtons[1];
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'You can only add 6 monsters to your dungeon',
        type: 'warning',
        duration: 3000,
      });
    });

    expect(addButton).toHaveTextContent('Add to dungeon');
  });
  it.skip('verifies dungeon status for a monster using DungeonContextMock', async () => {
    const mocks: MockedResponse[] = [
      ...generateMonstersMocks(initialMonsters),
      ...generateUserFavoritesMocks('1', [initialMonsters[0]]),
      ...generateMonsterReviewsMocks(initialMonsters),
    ];

    renderComponent(mocks, initialMonsters, [initialMonsters[0].id]);

    await waitFor(() => {
      expect(screen.getByTestId('Goblin-monster-card')).toBeInTheDocument();
      expect(screen.getByTestId('Orc-monster-card')).toBeInTheDocument();
    });

    const goblinCard = screen.getByTestId('Goblin-monster-card');
    const addToDungeonButton = within(goblinCard).queryByText('Add to dungeon');
    expect(addToDungeonButton).toBeNull();

    const removeFromDungeonButton = within(goblinCard).queryByText('Remove from dungeon');
    expect(removeFromDungeonButton).toBeInTheDocument();
  });
});
*/
