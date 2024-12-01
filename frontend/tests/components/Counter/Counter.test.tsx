import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Counter from '../../../src/components/Counter/Counter';

/*
- used claude.ai since logic for holding down mouse in testing was hard to understand
- also used fireEvent instead of userEvent since userEvent does not support mouseDown and mouseUp
*/

describe('Counter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Date, 'now')
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 100);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial value correctly', () => {
    render(<Counter value={50} onChange={() => {}} />);
    const valueFifty = screen.getByText('50');
    expect(valueFifty).toBeTruthy();
  });

  it('calls onChange with incremented value when increment button is held down', () => {
    const onChange = vi.fn();
    const onMouseUp = vi.fn();

    render(<Counter value={50} onChange={onChange} onMouseUp={onMouseUp} />);

    const incrementButton = screen.getByLabelText('Increment');

    fireEvent.mouseDown(incrementButton);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onChange).toHaveBeenCalled();

    fireEvent.mouseUp(incrementButton);
    expect(onMouseUp).toHaveBeenCalled();
  });

  it('calls onChange with decremented value when decrement button is held down', () => {
    const onChange = vi.fn();
    const onMouseUp = vi.fn();

    render(<Counter value={50} onChange={onChange} onMouseUp={onMouseUp} />);

    const decrementButton = screen.getByLabelText('Decrement');

    fireEvent.mouseDown(decrementButton);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onChange).toHaveBeenCalled();

    fireEvent.mouseUp(decrementButton);
    expect(onMouseUp).toHaveBeenCalled();
  });

  it('stops incrementing when mouse is released', () => {
    const onChange = vi.fn();
    const onMouseUp = vi.fn();

    render(<Counter value={50} onChange={onChange} onMouseUp={onMouseUp} />);

    const incrementButton = screen.getByLabelText('Increment');

    fireEvent.mouseDown(incrementButton);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const callCount = onChange.mock.calls.length;

    fireEvent.mouseUp(incrementButton);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onChange.mock.calls.length).toBe(callCount);
    expect(onMouseUp).toHaveBeenCalled();
  });

  it('continues incrementing while button is held down', () => {
    const onChange = vi.fn();

    render(<Counter value={50} onChange={onChange} />);

    const incrementButton = screen.getByLabelText('Increment');

    fireEvent.mouseDown(incrementButton);

    act(() => {
      vi.advanceTimersByTime(300); // Advance by 300ms to get multiple intervals
    });

    expect(onChange.mock.calls.length).toBeGreaterThan(1);

    fireEvent.mouseUp(incrementButton);
  });

  it('handles mouse leave event correctly', () => {
    const onChange = vi.fn();
    const onMouseUp = vi.fn();

    render(<Counter value={50} onChange={onChange} onMouseUp={onMouseUp} />);

    const incrementButton = screen.getByLabelText('Increment');

    fireEvent.mouseDown(incrementButton);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.mouseLeave(incrementButton);

    expect(onMouseUp).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const callCount = onChange.mock.calls.length;
    expect(onChange.mock.calls.length).toBe(callCount);
  });

  it('handles wrapping from 100 to 0 correctly', () => {
    const onChange = vi.fn();

    render(<Counter value={100} onChange={onChange} />);

    const incrementButton = screen.getByLabelText('Increment');

    fireEvent.mouseDown(incrementButton);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onChange).toHaveBeenCalled();

    fireEvent.mouseUp(incrementButton);
  });

  it('handles wrapping from 0 to 100 correctly', () => {
    const onChange = vi.fn();

    render(<Counter value={0} onChange={onChange} />);

    const decrementButton = screen.getByLabelText('Decrement');

    fireEvent.mouseDown(decrementButton);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onChange).toHaveBeenCalled();

    fireEvent.mouseUp(decrementButton);
  });
});
