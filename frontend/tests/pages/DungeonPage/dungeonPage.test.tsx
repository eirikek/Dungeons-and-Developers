/*
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import DungeonPage from '../../../src/pages/mainPages/dungeonPage.tsx';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import DungeonContextMock from '../../mocks/DungeonContextMock.tsx'; // Use the DungeonPage mock
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MonsterCardProps } from '../../../src/interfaces/MonsterCardProps.ts';
import {
  generateGetUserDungeonMock,
  generateUpdateDungeonNameMock,
  generateGetMonsterReviewsMock,
} from '../../utils/generateMocks.ts';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const userId = '1';
const token = 'mock-token'; // Mock token
const userName = 'Mock User'; // Mock user name

const mockMonsters: MonsterCardProps[] = [
  {
    id: '1',
    name: 'Goblin',
    hit_points: 30,
    type: 'Beast',
    size: 'Small',
    image: 'goblin.jpg',
    alignment: 'neutral evil',
  },
  {
    id: '2',
    name: 'Orc',
    hit_points: 50,
    type: 'Humanoid',
    size: 'Medium',
    image: 'orc.jpg',
    alignment: 'chaotic evil',
  },
];

const mocks = [
  generateGetUserDungeonMock(userId, {
    dungeonName: 'Example dungeon',
    favoritedMonsters: mockMonsters,
  }),
  generateUpdateDungeonNameMock(userId, 'New dungeon'),
  generateGetUserDungeonMock(userId, {
    dungeonName: 'New dungeon',
    favoritedMonsters: mockMonsters,
  }),
  generateGetMonsterReviewsMock('1', [
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
  ]),
  generateGetMonsterReviewsMock('2', [
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
  ]),
];

describe('DungeonPage', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/dungeon']}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
            <DungeonContextMock initialDungeon={['1', '2']} allMonsters={mockMonsters}>
              <DungeonPage />
            </DungeonContextMock>
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
      expect(screen.getByText(/Total Dungeon HP:\s*80/i)).toBeInTheDocument();
    });
  });

  it('checks if monster is in the dungeon', async () => {
    renderComponent();
    await waitFor(() => {
      const goblinCard = screen.getByTestId('Goblin-monster-card');
      expect(within(goblinCard).queryByText('Add to dungeon')).toBeNull();
      expect(within(goblinCard).getByText('Remove from dungeon')).toBeInTheDocument();

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

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Orc removed from dungeon',
          type: 'info',
          undoAction: expect.any(Function),
          duration: 5000,
        })
      );
      expect(screen.queryByTestId('Orc-monster-card')).not.toBeInTheDocument();
      expect(screen.getByText('Total Dungeon HP: 30')).toBeInTheDocument(); // Only Goblin remains
    });
  });

  it('undoes removing a monster', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Orc')).toBeInTheDocument();
    });

    const orcCard = screen.getByTestId('Orc-monster-card');
    const removeButtons = await within(orcCard).findAllByRole('button', { name: 'Remove from dungeon' });
    const removeButton = removeButtons[0];
    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenLastCalledWith(
        expect.objectContaining({
          message: 'Orc removed from dungeon',
          type: 'info',
          duration: 5000,
          undoAction: expect.any(Function),
        })
      );
      expect(screen.queryByTestId('Orc-monster-card')).not.toBeInTheDocument();
      expect(screen.getByText('Total Dungeon HP: 30')).toBeInTheDocument();
    });

    const undoFunction = mockShowToast.mock.calls[0][0].undoAction;
    mockShowToast.mockClear();

    await act(async () => {
      await undoFunction();
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Orc restored to dungeon',
          type: 'success',
          duration: 3000,
        })
      );
      expect(screen.getByTestId('Orc-monster-card')).toBeInTheDocument();
      expect(screen.getByText('Total Dungeon HP: 80')).toBeInTheDocument();
    });
  });
});
*/
