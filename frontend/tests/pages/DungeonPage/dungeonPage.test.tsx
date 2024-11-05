import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import DungeonPage from '../../../src/pages/mainPages/dungeonPage.tsx';
import { GET_USER_DUNGEON, UPDATE_DUNGEON_NAME } from '../../../../backend/src/graphql/queries.ts';
import { useToast } from '../../../src/hooks/useToast.ts';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { expect } from 'vitest';

const mockShowToast = vi.fn();
vi.mock('../hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const mockMonsters = [
  { id: '1', name: 'Goblin', hp: 30, type: 'Beast', size: 'Small', img: '' },
  { id: '2', name: 'Orc', hp: 50, type: 'Humanoid', size: 'Medium', img: '' },
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
];

describe('DungeonPage', () => {
  const userId = '1';
  const token = 'mock-token'; // Mock token
  const userName = 'Mock User'; // Mock user name

  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
          <BrowserRouter>
            <DungeonPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });

  it('renders correctly and matches snapshot', async () => {
    // Wait for the data to be loaded and elements to appear
    await waitFor(() => expect(screen.getByTestId('dungeon-name')).toBeInTheDocument());
    expect(screen.getByText('My Dungeon')).toBeInTheDocument();
    expect(screen.getByText('No monsters in dungeon')).toBeInTheDocument();

    // Snapshot testing
    expect(screen.getByRole('main')).toMatchSnapshot();
  });

  it('updates dungeon name on input save', async () => {
    const user = userEvent.setup();
    const editButton = screen.getByRole('button', { name: 'Edit Dungeon Name' });

    await user.click(editButton);
    // Use userEvent to change the input and simulate pressing Enter

    const input = screen.getByRole('textbox', { name: 'Edit name' });
    await user.clear(input);
    await user.type(input, 'New dungeon');

    const saveButton = screen.getByRole('button', { name: 'Save Dungeon Name' });

    await user.click(saveButton);

    // Check if the toast notification is shown
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Dungeon name updated successfully',
        type: 'success',
        duration: 3000,
      })
    );
    await waitFor(() => {
      expect(screen.getByTestId('dungeon-name')).toHaveTextContent('New dungeon');
    });
  });

  it('displays total HP when monsters are present', async () => {
    // Update the mock data to include monsters
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, userName, login: vi.fn(), logout: vi.fn(), token }}>
          <BrowserRouter>
            <DungeonPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );

    // Wait for the stats to update
    await waitFor(() => {
      expect(screen.getByText(/Total Dungeon HP: 80/i)).toBeInTheDocument();
    });
  });

  it('handles adding a monster to the dungeon', async () => {
    // Render the monster card
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, userName, login: vi.fn(), logout: vi.fn(), token }}>
          <BrowserRouter>
            <DungeonPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );

    // Simulate clicking the add button on the monster card using userEvent
    const addButton = screen.getByLabelText('Click to add to dungeon');
    await userEvent.click(addButton);

    // Verify if the toast is shown for adding monster
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Goblin added to dungeon',
        type: 'success',
        duration: 3000,
      })
    );
  });
});
