import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AbilityCounterWrapper from '../../../src/components/Counter/AbilityScoreCounterWrapper.tsx';

describe('AbilityCounterWrapper', () => {
  it('renders correctly with the initial value', () => {
    render(<AbilityCounterWrapper initialValue={10} onUpdate={vi.fn()} />);
    const valueDisplay = screen.getByLabelText('ability-score-value');
    expect(valueDisplay).toHaveTextContent('10');
  });

  it('applies the correct scale to the Counter component', () => {
    render(<AbilityCounterWrapper initialValue={10} onUpdate={vi.fn()} />);
    const container = screen.getByLabelText('ability-score-value').parentElement;
    expect(container).toHaveStyle({ transform: 'scale(1.5)' });
  });
});
