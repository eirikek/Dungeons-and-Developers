import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
/*
Mocked provider:
* https://www.apollographql.com/docs/react/development-testing/testing
*
*  */
import { MockedProvider } from '@apollo/client/testing';
import DungeonPage from '../../../src/pages/mainPages/dungeonPage.tsx';
import { GET_MONSTER_REVIEWS, GET_USER_DUNGEON, UPDATE_DUNGEON_NAME } from '../../../../backend/src/graphql/queries.ts';

import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { DungeonContext } from '../../../src/context/DungeonContext.tsx';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const mockToggleDungeon = vi.fn(() => {
  mockShowToast({
    message: 'Goblin added to dungeon',
    type: 'success',
    duration: 3000,
  });
});

const mockMonsters = [
  { id: '1', name: 'Goblin', hp: 30, type: 'Beast', size: 'Small', img: '', alignment: 'neutral evil' },
  { id: '2', name: 'Orc', hp: 50, type: 'Humanoid', size: 'Medium', img: '', alignment: 'chaotic evil' },
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
  {
    request: {
      query: UPDATE_DUNGEON_NAME,
      variables: { userId: '1', dungeonName: 'New dungeon' },
    },
    result: {
      data: {
        updateDungeonName: {
          dungeonName: 'New dungeon',
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_DUNGEON,
      variables: { userId: '1' },
    },
    result: {
      data: {
        user: {
          dungeonName: 'New dungeon',
          favoritedMonsters: mockMonsters,
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
                id: 'user-1',
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

describe('DungeonPage', () => {
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
              toggleDungeon: mockToggleDungeon,
              isInDungeon: (monsterId) => monsterId !== '1',
            }}
          >
            <BrowserRouter>
              <DungeonPage />
            </BrowserRouter>
          </DungeonContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });

  it('renders correctly and matches snapshot', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('dungeon-name')).toBeInTheDocument();

      expect(screen.getByText('Example dungeon')).toBeInTheDocument();
    });
    expect(screen.queryByText('No monsters in dungeon')).toBeNull();

    expect(screen.getByRole('main')).toMatchSnapshot();
  });

  it('updates dungeon name on input save', async () => {
    const user = userEvent.setup();
    const editButton = screen.getByRole('button', { name: 'Edit Dungeon Name' });

    await waitFor(() => {
      user.click(editButton);
    });

    const input = await screen.findByLabelText('Edit name');

    await user.clear(input);
    await user.type(input, 'New dungeon');

    const saveButton = screen.getByRole('button', { name: 'Save Dungeon Name' });

    await waitFor(() => {
      user.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dungeon-name')).toHaveTextContent('New dungeon');
    });
  });

  it('displays total HP when monsters are present', async () => {
    await waitFor(() => {
      expect(screen.getByText('Total Dungeon HP: 80')).toBeInTheDocument();
    });
  });

  it('handles adding a monster to the dungeon', async () => {
    const user = userEvent.setup();
    const monsterCard = screen.getByTestId('Goblin-monster-card');
    // const addButton = within(monsterCard).getByRole('button', { name: 'Click to add to dungeon' });
    const addButton = within(monsterCard).getByText('Add to dungeon');
    await user.click(addButton);

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Goblin added to dungeon',
        type: 'success',
        duration: 3000,
      })
    );
  });
});
