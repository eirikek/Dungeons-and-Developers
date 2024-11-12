import { act, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
/*
Mocked provider:
* https://www.apollographql.com/docs/react/development-testing/testing
*
*  */
import { MockedProvider } from '@apollo/client/testing';
import { GET_MONSTER_REVIEWS, GET_USER_DUNGEON, UPDATE_DUNGEON_NAME } from '../../../src/graphql/queries.ts';
import DungeonPage from '../../../src/pages/mainPages/dungeonPage.tsx';

import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { DungeonContext, DungeonProvider } from '../../../src/context/DungeonContext.tsx';
import { afterEach, expect } from 'vitest';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const mockToggleDungeon = vi.fn((monster) => {
  if (monster.id === '2') {
    mockShowToast({
      message: `${monster.name} removed from dungeon`,
      type: 'info',
      duration: 5000,
    });
  } else {
    mockShowToast({
      message: `${monster.name} added to dungeon`,
      type: 'success',
      duration: 3000,
    });
  }
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

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/dungeon']}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
            <DungeonProvider userId={userId}>
              <DungeonPage />
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

  it('renders correctly and matches snapshot', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('dungeon-name')).toBeInTheDocument();
      expect(screen.getByText('Example dungeon')).toBeInTheDocument();
    });
    expect(screen.queryByText('No monsters in dungeon')).toBeNull();

    expect(screen.getByRole('main')).toMatchSnapshot();
  });

  it('updates dungeon name on input save', async () => {
    renderComponent();
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
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Total Dungeon HP: 80')).toBeInTheDocument();
    });
  });

  it('checks if monster is in the dungeon', async () => {
    renderComponent();
    await waitFor(() => {
      const goblinCard = screen.getByTestId('Goblin-monster-card');
      expect(within(goblinCard).queryByText('Remove from dungeon')).toBeNull();
      expect(within(goblinCard).getByText('Add to dungeon')).toBeInTheDocument();

      const orcCard = screen.getByTestId('Orc-monster-card');
      expect(within(orcCard).queryByText('Add to dungeon')).toBeNull();
      expect(within(orcCard).getByText('Remove from dungeon')).toBeInTheDocument();
    });
  });

  it('handles removing a monster from dungeon', async () => {
    renderComponent();
    const user = userEvent.setup();
    const monsterCard = screen.getByTestId('Orc-monster-card');
    const removeButton = within(monsterCard).getByText('Remove from dungeon');
    expect(removeButton).toBeInTheDocument();

    await user.click(removeButton);

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Orc removed from dungeon',
        type: 'info',
        duration: 5000,
      })
    );
    expect(screen.queryByTestId('Orc-monster-card')).not.toBeInTheDocument();
    expect(screen.getByText('Total Dungeon HP: 30')).toBeInTheDocument(); // Only Goblin remains
  });
  it('undoes removing a monster', async () => {
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

    const undoFunction = mockShowToast.mock.calls[0][0].undoAction;
    await act(async () => {
      await undoFunction();
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Orc restored to dungeon',
        type: 'success',
        duration: 3000,
      });
      expect(screen.getByTestId('Orc-monster-card')).toBeInTheDocument();
      expect(screen.getByText('Total Dungeon HP: 22')).toBeInTheDocument();
    });
  });
});
