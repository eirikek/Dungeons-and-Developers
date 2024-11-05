import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '../../../src/components/Counter/Counter';
import { vi } from 'vitest';

describe('Counter Component', () => {
  const onChangeMock = vi.fn();
  const onPointerUpMock = vi.fn();
  const onMouseUpMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with initial value and buttons', () => {
    render(<Counter value={50} onChange={onChangeMock} />);
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Increment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Decrement/i })).toBeInTheDocument();
  });

  describe('increment functionality', () => {
    it('calls onChange continuously with incremented value while holding increment button', async () => {
      const user = userEvent.setup();
      vi.useFakeTimers();

      render(<Counter value={50} onChange={onChangeMock} onPointerUp={onPointerUpMock} onMouseUp={onMouseUpMock} />);
      const incrementButton = screen.getByRole('button', { name: /Increment/i });

      await user.pointer([{ target: incrementButton, keys: '[MouseLeft>]' }]);
      vi.advanceTimersByTime(100);

      expect(onChangeMock).toHaveBeenCalledWith(51);

      vi.advanceTimersByTime(100);
      expect(onChangeMock).toHaveBeenCalledWith(52);

      await user.pointer([{ target: incrementButton, keys: '[/MouseLeft]' }]);

      expect(onPointerUpMock).toHaveBeenCalled();
      expect(onMouseUpMock).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('decrement functionality', () => {
    it('calls onChange continuously with decremented value while holding decrement button', async () => {
      const user = userEvent.setup();
      vi.useFakeTimers();

      render(<Counter value={50} onChange={onChangeMock} />);
      const decrementButton = screen.getByRole('button', { name: /Decrement/i });

      await user.pointer([{ target: decrementButton, keys: '[MouseLeft>]' }]);
      vi.advanceTimersByTime(100);
      expect(onChangeMock).toHaveBeenCalledWith(49);

      vi.advanceTimersByTime(100);
      expect(onChangeMock).toHaveBeenCalledWith(48);

      await user.pointer([{ target: decrementButton, keys: '[/MouseLeft]' }]);
    });
  });

  describe('boundary conditions', () => {
    it('wraps around to 0 when incrementing above 100', async () => {
      render(<Counter value={99} onChange={onChangeMock} />);
      const incrementButton = screen.getByRole('button', { name: /Increment/i });

      await userEvent.click(incrementButton);
      expect(onChangeMock).toHaveBeenCalledWith(100);

      await userEvent.click(incrementButton);
      expect(onChangeMock).toHaveBeenCalledWith(0);
    });

    it('wraps around to 100 when decrementing below 0', async () => {
      render(<Counter value={1} onChange={onChangeMock} />);
      const decrementButton = screen.getByRole('button', { name: /Decrement/i });

      await userEvent.click(decrementButton);
      expect(onChangeMock).toHaveBeenCalledWith(0);

      await userEvent.click(decrementButton);
      expect(onChangeMock).toHaveBeenCalledWith(100);
    });
  });
});
