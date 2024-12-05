import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingHourglass from '../../../src/components/LoadingHourglass/LoadingHourglass.tsx';
import { hourglass } from 'ldrs';

vi.mock('ldrs', () => ({
  hourglass: {
    register: vi.fn(),
  },
}));

describe('LoadingHourglass', () => {
  it('renders the hourglass component with default height', () => {
    render(<LoadingHourglass />);

    const hourglassElement = screen.getByTestId('hourglass-container');
    expect(hourglassElement).toBeInTheDocument();

    expect(hourglassElement).toHaveClass('h-[79.5vh]');
  });

  it('renders the hourglass component with custom height', () => {
    render(<LoadingHourglass height="h-[50vh]" />);

    const hourglassElement = screen.getByTestId('hourglass-container');
    expect(hourglassElement).toBeInTheDocument();

    expect(hourglassElement).toHaveClass('h-[50vh]');
  });

  it('calls hourglass.register on render', () => {
    render(<LoadingHourglass />);
    expect(hourglass.register).toHaveBeenCalledTimes(1);
  });
});
