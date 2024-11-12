import { render, screen, waitFor, act, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import MonsterPage from '../../../src/pages/mainPages/monsterPage.tsx';
import {
  ADD_FAVORITE_MONSTER,
  GET_MONSTER_REVIEWS,
  GET_MONSTERS,
  GET_USER_FAVORITES,
  REMOVE_FAVORITE_MONSTER,
} from '../../../src/graphql/queries.ts';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { GraphQLError } from 'graphql/error';
import { afterEach, beforeEach, expect } from 'vitest';
import { DungeonProvider } from '../../../src/context/DungeonContext.tsx';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const monstersPerPage = 8;

const mockMonsters = [
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

const userId = '1';
const token = 'mock-token';
const userName = 'Mock User';

const mocks = [
  {
    // Initial GET request with no favorited monsters
    request: {
      query: GET_USER_FAVORITES,
      variables: { userId: userId },
    },
    result: {
      data: {
        user: {
          userId: userId,
          favoritedMonsters: [], // Start with an empty dungeon
        },
      },
    },
  },
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
          monsters: mockMonsters,
          totalMonsters: mockMonsters.length,
        },
      },
    },
  },
  {
    request: {
      query: ADD_FAVORITE_MONSTER,
      variables: { userId: userId, monsterId: mockMonsters[1].id },
    },
    result: {
      data: {
        addFavoriteMonster: {
          favoritedMonsters: [mockMonsters[1].id],
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_FAVORITES,
      variables: { userId: userId },
    },
    result: {
      data: {
        user: {
          userId: userId,
          favoritedMonsters: [mockMonsters[1]],
        },
      },
    },
  },
  {
    request: {
      query: REMOVE_FAVORITE_MONSTER,
      variables: { userId: userId, monsterId: mockMonsters[1].id },
    },
    result: {
      data: {
        addFavoriteMonster: {
          favoritedMonsters: [],
        },
      },
    },
  },

  {
    // Mock for removing Orc from the favorites
    request: {
      query: GET_USER_FAVORITES,
      variables: { userId: userId },
    },
    result: {
      data: {
        user: {
          userId: userId,
          favoritedMonsters: [], // Orc removed from favorites
        },
      },
    },
  },
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: '1' },
    },
    result: {
      data: {
        monster: {
          reviews: [
            {
              id: 'review-1',
              user: {
                id: 'user-1',
                userName: 'Alice',
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
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: '2' },
    },
    result: {
      data: {
        monster: {
          reviews: [
            {
              id: 'review-2',
              user: {
                id: 'user-2',
                userName: 'Bob',
              },
              difficulty: 3,
              description: 'A challenging but fair fight.',
              createdAt: '2024-11-05T12:00:00Z',
            },
          ],
        },
      },
    },
  },
];

describe('MonsterPage', () => {
  const renderComponent = (providerMocks = mocks) =>
    render(
      <MemoryRouter initialEntries={['/monsters']}>
        <MockedProvider mocks={providerMocks} addTypename={false}>
          <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
            <DungeonProvider userId={userId}>
              <MonsterPage />
            </DungeonProvider>
          </AuthContext.Provider>
        </MockedProvider>
      </MemoryRouter>
    );

  beforeEach(() => {
    mockShowToast.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const loadingMocks = [
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
      {
        request: {
          query: GET_USER_FAVORITES,
          variables: { userId: userId },
        },
        result: {
          data: {
            user: {
              userId: userId,
              favoritedMonsters: [],
            },
          },
        },
      },
    ];
    renderComponent(loadingMocks);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('renders monsters after loading', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Goblin')).toBeInTheDocument();
      expect(screen.getByText('Orc')).toBeInTheDocument();
    });

    const monsterCards = await screen.findAllByTestId(/-monster-card$/);
    expect(monsterCards.length).toBe(mockMonsters.length);
  });

  it('displays error message on error', async () => {
    const errorMocks = [
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
        result: { data: { monsters: { monsters: [], totalMonsters: 0 } } },
      },
      {
        request: {
          query: GET_USER_FAVORITES,
          variables: { userId: userId },
        },
        result: {
          data: {
            user: {
              userId: userId,
              favoritedMonsters: [],
            },
          },
        },
      },
    ];

    renderComponent(errorMocks);

    await waitFor(() => {
      expect(screen.getByText('An error occurred while loading monsters.')).toBeInTheDocument();
    });
  });

  it('updates monsters when search term is entered', async () => {
    const searchTerm = 'Dragon';
    const searchMocks = [
      ...mocks,
      {
        request: {
          query: GET_MONSTERS,
          variables: {
            searchTerm: searchTerm,
            offset: 0,
            limit: monstersPerPage,
            types: [],
          },
        },
        result: {
          data: {
            monsters: {
              monsters: [
                {
                  id: '3',
                  name: 'Dragon',
                  type: 'dragon',
                  hit_points: 200,
                  alignment: 'chaotic evil',
                  size: 'large',
                  image: 'dragon.jpg',
                },
              ],
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
                  id: 'review-1',
                  user: {
                    id: 'user-1',
                    userName: 'Alice',
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

    renderComponent(searchMocks);

    await waitFor(() => {
      expect(screen.getByText('Goblin')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search for a monster...');
    await userEvent.type(searchInput, searchTerm);

    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));

    await waitFor(() => {
      expect(screen.getByText('Dragon')).toBeInTheDocument();
    });

    expect(screen.queryByText('Goblin')).not.toBeInTheDocument();
  });

  it('displays "No monsters found" when there are no results', async () => {
    const searchTerm = 'NonExistentMonster';
    const noResultsMocks = [
      ...mocks,
      {
        request: {
          query: GET_MONSTERS,
          variables: {
            searchTerm: searchTerm,
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

    renderComponent(noResultsMocks);

    await waitFor(() => {
      expect(screen.getByText('Goblin')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search for a monster...');
    await userEvent.type(searchInput, searchTerm);

    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));

    await waitFor(() => {
      expect(screen.getByText('No monsters found')).toBeInTheDocument();
    });

    expect(screen.queryByText('Goblin')).not.toBeInTheDocument();
  });
  it('adds a monster to the dungeon', async () => {
    renderComponent();
    const orcCard = await screen.findByTestId('Orc-monster-card');

    expect(orcCard).toBeInTheDocument();

    const addButton = within(orcCard).getAllByRole('button', { name: 'Add to dungeon' })[0];
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Orc added to dungeon',
        type: 'success',
        duration: 3000,
      });
    });
  });
  it('removes a monster from the dungeon', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Orc')).toBeInTheDocument();
    });

    const orcCard = screen.getByTestId('Orc-monster-card');
    const removeButton = within(orcCard).getByRole('button', { name: 'Remove from dungeon' });

    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Orc removed from dungeon',
        type: 'info',
        duration: 5000,
      });
      expect(screen.queryByTestId('Orc-monster-card')).not.toBeInTheDocument();
      expect(screen.getByText('Total Dungeon HP: 7')).toBeInTheDocument();
    });
  });

  it('shows warning when adding a monster at max capacity', async () => {
    const sixMonsters = Array.from({ length: 6 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Monster${i + 1}`,
      hit_points: 10,
      type: 'Beast',
      size: 'Medium',
      image: '',
      alignment: 'neutral evil',
    }));

    const maxMocks = [
      {
        request: {
          query: GET_USER_FAVORITES,
          variables: { userId: '1' },
        },
        result: {
          data: {
            user: {
              favoritedMonsters: sixMonsters,
            },
          },
        },
      },
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
              monsters: sixMonsters,
              totalMonsters: sixMonsters.length,
            },
          },
        },
      },
    ];

    renderComponent(maxMocks);

    await waitFor(() => {
      expect(screen.getByText('Total Dungeon HP: 60')).toBeInTheDocument();
    });

    const goblinCard = screen.getByTestId('Monster3-monster-card');

    const button = within(goblinCard).getByRole('button', { name: 'Add to dungeon' });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'You can only add 6 monsters to your dungeon',
        type: 'warning',
        duration: 3000,
      });
    });

    expect(button).toHaveTextContent('Add to dungeon');
  });
});
