import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonsterFilter from '../../../src/components/MonsterFilter/MonsterFilter';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { AuthContext } from '../../../src/context/AuthContext';
import { GET_MONSTER_HP_RANGE, GET_MONSTER_TYPE_COUNTS } from '../../../src/graphql/queries/monsterQueries';

const mockAuthContextValue = { userId: '12345', userName: 'Bob', token: '32', login: vi.fn(), logout: vi.fn() };

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const mockSetSelectedFilters = vi.fn();

let selectedFilters = new Set<string>();
const mockMonsterCounts = {
  dragon: 5,
  fiend: 0,
  humanoid: 8,
};

const mockMonsterTypes = ['dragon', 'fiend', 'humanoid'];

const mockOnClearFilters = () => {};
const mockOnHpChange = () => {};
const mockSetCurrentPage = () => {};

const searchTerm = '';

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
  {
    request: {
      query: GET_MONSTER_TYPE_COUNTS,
      variables: { minHp: 10, maxHp: 100 },
    },
    result: {
      data: {
        monsterTypeCounts: [
          { type: 'dragon', count: 5 },
          { type: 'fiend', count: 0 },
          { type: 'humanoid', count: 8 },
        ],
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
        <AuthContext.Provider value={mockAuthContextValue}>
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
            searchTerm={searchTerm}
            monsterTypes={mockMonsterTypes}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('opens and closes the dropdown menu', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
            searchTerm={searchTerm}
            monsterTypes={mockMonsterTypes}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );
    const filterButton = screen.getByText('Filter Monsters');

    await userEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('Clear Filters')).toBeTruthy();
    });

    const closeButton = screen.getByLabelText('Close');
    await userEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('Clear Filters')).not.toBeTruthy();
    });
  });

  it('fetches and displays monster types correctly', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
            searchTerm={searchTerm}
            monsterTypes={mockMonsterTypes}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );

    const filterButton = screen.getByText('Filter Monsters');
    await userEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('dragon (5)')).toBeTruthy();
      expect(screen.getByText('fiend')).toBeTruthy();
      expect(screen.getByText('humanoid (8)')).toBeTruthy();
    });
  });

  it('toggles filters and updates selected filters correctly', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
            searchTerm={searchTerm}
            monsterTypes={mockMonsterTypes}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );
    const filterButton = screen.getByText('Filter Monsters');

    await userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getByText('dragon (5)')).toBeTruthy();
    });

    const dragonLabel = screen.getByText('dragon (5)');
    await userEvent.click(dragonLabel);
    await waitFor(() => {
      expect(mockSetSelectedFilters).toHaveBeenCalledTimes(1);
      const updaterFunction = mockSetSelectedFilters.mock.calls[0][0];
      const updatedSet = updaterFunction(new Set());
      expect(updatedSet).toContain('dragon');
    });

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
        <AuthContext.Provider value={mockAuthContextValue}>
          <MonsterFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={mockSetSelectedFilters}
            monsterCounts={mockMonsterCounts}
            onClearFilters={mockOnClearFilters}
            onHpChange={mockOnHpChange}
            setCurrentPage={mockSetCurrentPage}
            searchTerm={searchTerm}
            monsterTypes={[]}
          />
        </AuthContext.Provider>
      </MockedProvider>
    );
    const filterButton = screen.getByText('Filter Monsters');
    await userEvent.click(filterButton);

    const clearButton = screen.getByText('Clear Filters');
    await userEvent.click(clearButton);

    expect(mockSetSelectedFilters).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedFilters).toHaveBeenCalledWith(new Set());
  });
});
