import { render, screen, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import MonsterPage from '../../../src/pages/mainPages/monsterPage.tsx';
import { GET_MONSTER_REVIEWS, GET_MONSTERS } from '../../../../backend/src/graphql/queries';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { GraphQLError } from 'graphql/error';

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

const mocks = [
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
  const userId = '1';
  const token = 'mock-token';
  const userName = 'Mock User';

  const renderComponent = (providerMocks = mocks) =>
    render(
      <MemoryRouter initialEntries={['/monsters']}>
        <MockedProvider mocks={providerMocks} addTypename={false}>
          <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
            <MonsterPage />
          </AuthContext.Provider>
        </MockedProvider>
      </MemoryRouter>
    );

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
    ];
    renderComponent(loadingMocks);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('renders monsters after loading', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MonsterPage />
        </MockedProvider>
      </MemoryRouter>
    );

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
});
