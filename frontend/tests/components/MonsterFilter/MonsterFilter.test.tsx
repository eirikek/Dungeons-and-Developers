import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonsterFilter from '../../../src/components/MonsterFilter/MonsterFilter.tsx';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { GET_MONSTER_HP_RANGE } from '../../../src/graphql/getMonsterQuerie.ts';

// Mock props for the MonsterFilter component
const mockSetSelectedFilters = vi.fn();
let selectedFilters = new Set<string>();
const mockMonsterCounts = {
  dragon: 5,
  fiend: 0,
};
const mockOnClearFilters = () => {};
const mockOnHpChange = () => {};
const mockSetCurrentPage = () => {};

const mockUserId = 'user-321';
const mockToken = 'mock-token';
const mockUsername = 'Bob';
const mockLogin = vi.fn();
const mockLogout = vi.fn();

const mocks = [
  {
    request: {
      query: GET_MONSTER_HP_RANGE,
    },
    result: {
      data: {
        monsterHpRange: {
          minHp: 10,
          maxHp: 50,
          __typename: 'MonsterHpRange',
        },
      },
    },
  },
];
describe('MonsterFilter Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    selectedFilters = new Set();
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider
          value={{ userId: mockUserId, userName: mockUsername, logout: mockLogout, login: mockLogin, token: mockToken }}
        >
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('opens and closes the dropdown menu', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider
          value={{ userId: mockUserId, userName: mockUsername, logout: mockLogout, login: mockLogin, token: mockToken }}
        >
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );
    const filterButton = screen.getByText('Filter Monsters');

    // Click to open dropdown
    await userEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    // Click on close icon to close dropdown
    const closeButton = screen.getByLabelText('Close');
    await userEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
    });
  });

  it('toggles filters and updates selected filters correctly', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider
          value={{ userId: mockUserId, userName: mockUsername, logout: mockLogout, login: mockLogin, token: mockToken }}
        >
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );
    const filterButton = screen.getByText('Filter Monsters');

    // Open dropdown
    await userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getByText('dragon (5)')).toBeInTheDocument();
    });

    // Select "dragon" filter
    const dragonLabel = screen.getByText('dragon (5)');
    await userEvent.click(dragonLabel);
    await waitFor(() => {
      expect(mockSetSelectedFilters).toHaveBeenCalledTimes(1);
      const updaterFunction = mockSetSelectedFilters.mock.calls[0][0];
      const updatedSet = updaterFunction(new Set());
      expect(updatedSet).toContain('dragon');
    });

    // Unselect "dragon" filter
    await userEvent.click(dragonLabel);
    await waitFor(() => {
      expect(mockSetSelectedFilters).toHaveBeenCalledTimes(2);
      const updaterFunction = mockSetSelectedFilters.mock.calls[1][0];
      const updatedSet = updaterFunction(new Set(['dragon']));
      expect(updatedSet).not.toContain('dragon');
    });
  });

  it('clears all selected filters', async () => {
    selectedFilters = new Set(['dragon', 'humanoid']);
    render(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider
          value={{ userId: mockUserId, userName: mockUsername, logout: mockLogout, login: mockLogin, token: mockToken }}
        >
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );

    // Open dropdown
    const filterButton = screen.getByText('Filter Monsters');
    await userEvent.click(filterButton);

    // Click clear filters
    const clearButton = screen.getByText('Clear Filters');
    await userEvent.click(clearButton);

    expect(mockSetSelectedFilters).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedFilters).toHaveBeenCalledWith(new Set());
  });
});
