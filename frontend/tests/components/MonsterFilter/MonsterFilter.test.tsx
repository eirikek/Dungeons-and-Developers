import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonsterFilter from '../../../src/components/MonsterFilter/MonsterFilter.tsx';
import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock props for the MonsterFilter component
const mockSetSelectedFilters = vi.fn();
let selectedFilters = new Set<string>();

describe('MonsterFilter Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    selectedFilters = new Set();
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(
      <MonsterFilter selectedFilters={selectedFilters} setSelectedFilters={mockSetSelectedFilters} />
    );
    expect(container).toMatchSnapshot();
  });

  it('opens and closes the dropdown menu', async () => {
    render(<MonsterFilter selectedFilters={selectedFilters} setSelectedFilters={mockSetSelectedFilters} />);
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
    render(<MonsterFilter selectedFilters={selectedFilters} setSelectedFilters={mockSetSelectedFilters} />);
    const filterButton = screen.getByText('Filter Monsters');

    // Open dropdown
    await userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getByText('dragon')).toBeInTheDocument();
    });

    // Select "dragon" filter
    const dragonLabel = screen.getByText('dragon');
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
    render(<MonsterFilter selectedFilters={selectedFilters} setSelectedFilters={mockSetSelectedFilters} />);

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
