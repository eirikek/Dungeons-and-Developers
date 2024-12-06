import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SortDropdown from '../../../src/components/MonsterSort/MonsterSort.tsx';

describe('SortDropdown Component', () => {
  const mockOnSortChange = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
    mockOnSortChange.mockReset();
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<SortDropdown selectedSort="name-asc" onSortChange={mockOnSortChange} />);
    expect(container).toMatchSnapshot();
  });

  it('opens and closes the dropdown menu', async () => {
    render(<SortDropdown selectedSort="name-asc" onSortChange={mockOnSortChange} />);

    const toggleButton = screen.getByText('A-Z');
    await userEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Z-A')).toBeInTheDocument();
    });

    const button = screen.getByLabelText('close-button');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Z-A')).not.toBeInTheDocument();
    });
  });

  it('calls onSortChange when a sort option is selected', async () => {
    render(<SortDropdown selectedSort="name-asc" onSortChange={mockOnSortChange} />);

    const toggleButton = screen.getByText('A-Z');
    await userEvent.click(toggleButton);

    const sortOption = screen.getByText('Difficulty: High-Low');
    await userEvent.click(sortOption);

    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
    expect(mockOnSortChange).toHaveBeenCalledWith('difficulty-desc');
  });

  it('highlights the selected sort option', async () => {
    render(<SortDropdown selectedSort="difficulty-desc" onSortChange={mockOnSortChange} />);

    const toggleButton = screen.getByText('Difficulty: High-Low');
    await userEvent.click(toggleButton);

    const selectedOption = screen.queryAllByText('Difficulty: High-Low')[1];
    expect(selectedOption).toHaveClass('font-bold');
  });

  it('closes the dropdown when clicking outside', async () => {
    render(<SortDropdown selectedSort="name-asc" onSortChange={mockOnSortChange} />);

    const toggleButton = screen.getByText('A-Z');
    await userEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Z-A')).toBeInTheDocument();
    });

    fireEvent.mouseDown(document.body); // click outside

    await waitFor(() => {
      expect(screen.queryByText('Z-A')).not.toBeInTheDocument();
    });
  });
});
