import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect } from 'vitest';
import DungeonButton from '../../../src/components/MonsterCard/DungeonButton.tsx';

describe('DungeonButton Component', () => {
  const mockOnAddToDungeonClick = vi.fn();

  it('renders correctly when the monster is not in the dungeon', () => {
    render(<DungeonButton onAddToDungeonClick={mockOnAddToDungeonClick} isInDungeon={false} />);

    const button = screen.getByRole('button', { name: /add to dungeon/i });
    expect(button).toBeInTheDocument();

    const icon = screen.getByLabelText('gate-icon');
    expect(icon).toHaveClass('text-white');
  });

  it('renders correctly when the monster is in the dungeon', () => {
    render(<DungeonButton onAddToDungeonClick={mockOnAddToDungeonClick} isInDungeon={true} />);

    const button = screen.getByRole('button', { name: /remove from dungeon/i });
    expect(button).toBeInTheDocument();

    const icon = screen.getByLabelText('gate-icon');
    expect(icon).toHaveClass('text-black');
  });

  it('calls the onAddToDungeonClick function when clicked', async () => {
    render(<DungeonButton onAddToDungeonClick={mockOnAddToDungeonClick} isInDungeon={false} />);

    const button = screen.getByRole('button', { name: /add to dungeon/i });
    await userEvent.click(button);

    expect(mockOnAddToDungeonClick).toHaveBeenCalledTimes(1);
  });
});
