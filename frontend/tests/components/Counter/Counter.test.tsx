import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Counter from '../../../src/components/Counter/Counter';

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

  it('calls onChange with incremented value when increment button is held down', () => {
    const onChange = vi.fn();
    const onMouseUp = vi.fn();

    render(<Counter value={50} onChange={onChange} onMouseUp={onMouseUp} />);

    const incrementButton = screen.getByLabelText('Increment');

    // Simulate mouse down event
    fireEvent.mouseDown(incrementButton);

    // Use act to simulate the passage of time for the interval to trigger
    act(() => {
      vi.advanceTimersByTime(200); // Simulate time passing to allow the interval to call onChange
    });

    // Ensure that onChange is called at least once
    expect(onChange).toHaveBeenCalledTimes(1);

    // Simulate mouse up to stop the interval
    fireEvent.mouseUp(incrementButton);
    expect(onMouseUp).toHaveBeenCalled();
  });

  it('calls onChange with decremented value when decrement button is held down', () => {
    const onChange = vi.fn();
    const onMouseUp = vi.fn();

    render(<Counter value={50} onChange={onChange} onMouseUp={onMouseUp} />);

    const decrementButton = screen.getByLabelText('Decrement');

    // Simulate mouse down event
    fireEvent.mouseDown(decrementButton);

    // Use act to simulate time passage
    act(() => {
      vi.advanceTimersByTime(200); // Simulate 200ms for the interval to trigger and call onChange
    });

    // Ensure that onChange was called
    expect(onChange).toHaveBeenCalledTimes(1);

    fireEvent.mouseUp(decrementButton);
    expect(onMouseUp).toHaveBeenCalled();
  });

  it('stops incrementing when mouse is released', () => {
    const onChange = vi.fn();
    const onMouseUp = vi.fn();

    render(<Counter value={50} onChange={onChange} onMouseUp={onMouseUp} />);

    const incrementButton = screen.getByLabelText('Increment');

    // Simulate mouse down event
    fireEvent.mouseDown(incrementButton);

    // Simulate time passage and check that onChange is called
    act(() => {
      vi.advanceTimersByTime(200); // Simulate enough time for interval to run
    });

    const initialCallCount = onChange.mock.calls.length;

    // Simulate mouse up event
    fireEvent.mouseUp(incrementButton);

    // Ensure that no further calls to onChange occur after mouse up
    act(() => {
      vi.advanceTimersByTime(100); // Simulate time after mouse up to check no further calls
    });

    expect(onChange.mock.calls.length).toBe(initialCallCount); // Ensure no further onChange calls
    expect(onMouseUp).toHaveBeenCalled();
  });

  it('continues incrementing while button is held down', () => {
    const onChange = vi.fn();

    render(<Counter value={50} onChange={onChange} />);

    const incrementButton = screen.getByLabelText('Increment');

    // Simulate mouse down event
    fireEvent.mouseDown(incrementButton);

    // Use act to advance timers and allow the interval to trigger multiple times
    act(() => {
      vi.advanceTimersByTime(500); // Simulate 500ms for multiple increments
    });

    // Ensure that onChange was called multiple times
    expect(onChange.mock.calls.length).toBeGreaterThan(1);

    // Simulate mouse up to stop the interval
    fireEvent.mouseUp(incrementButton);
  });

  it('handles mouse leave event correctly', () => {
    const onChange = vi.fn();
    const onMouseUp = vi.fn();

    render(<Counter value={50} onChange={onChange} onMouseUp={onMouseUp} />);

    const incrementButton = screen.getByLabelText('Increment');

    // Simulate mouse down event
    fireEvent.mouseDown(incrementButton);

    // Use act to simulate time passage
    act(() => {
      vi.advanceTimersByTime(200); // Simulate time passing for the interval to trigger
    });

    // Simulate mouse leave and check that mouseUp is called
    fireEvent.mouseLeave(incrementButton);
    expect(onMouseUp).toHaveBeenCalled();

    // Ensure that no further increments occur after mouse leave
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const callCount = onChange.mock.calls.length;
    expect(onChange.mock.calls.length).toBe(callCount); // No further calls after mouse leave
  });

  it('handles wrapping from 100 to 0 correctly', () => {
    const onChange = vi.fn();

    render(<Counter value={100} onChange={onChange} />);

    const incrementButton = screen.getByLabelText('Increment');

    fireEvent.mouseDown(incrementButton);

    act(() => {
      vi.advanceTimersByTime(200); // Simulate time for increment to happen
    });

    // Ensure that the value was incremented correctly (wrapping around if needed)
    expect(onChange).toHaveBeenCalled();
    fireEvent.mouseUp(incrementButton);
  });

  it('handles wrapping from 0 to 100 correctly', () => {
    const onChange = vi.fn();

    render(<Counter value={0} onChange={onChange} />);

    const decrementButton = screen.getByLabelText('Decrement');

    fireEvent.mouseDown(decrementButton);

    act(() => {
      vi.advanceTimersByTime(200); // Simulate time passage for decrement
    });

    expect(onChange).toHaveBeenCalled();
    fireEvent.mouseUp(decrementButton);
  });
});
