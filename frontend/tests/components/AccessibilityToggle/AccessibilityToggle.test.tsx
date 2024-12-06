import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { describe, expect, it, MockedFunction, vi } from 'vitest';
import AccessibilityToggle from '../../../src/components/AccessibilityToggle/AccessibilityToggle.tsx';
import { useAccessibilityContext } from '../../../src/context/AccessibilityContext.ts';

vi.mock('../../../src/context/AccessibilityContext.ts', async () => {
  const original = await vi.importActual('../../../src/context/AccessibilityContext.ts');
  return {
    ...original,
    useAccessibilityContext: vi.fn(),
  };
});

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

describe('AccessibilityToggle', () => {
  const mockToggleAccessibilityMode = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (useAccessibilityContext as MockedFunction<typeof useAccessibilityContext>).mockReturnValue({
      isAccessibilityMode: false,
      toggleAccessibilityMode: mockToggleAccessibilityMode,
    });
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
      hash: '',
      key: '',
      search: '',
      state: undefined,
      pathname: '/some-page',
    });
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<AccessibilityToggle checked={false} onChange={mockOnChange} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays the icon with inverted filter on the login page', () => {
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
      hash: '',
      key: '',
      search: '',
      state: undefined,
      pathname: '/',
    });

    render(<AccessibilityToggle checked={false} onChange={mockOnChange} />);

    const icon = screen.getByAltText(/accessability icon/i);
    expect(icon).toHaveClass('filter invert');
  });

  it('displays the icon without inverted filter on other pages', () => {
    render(<AccessibilityToggle checked={false} onChange={mockOnChange} />);

    const icon = screen.getByAltText(/accessability icon/i);
    expect(icon).not.toHaveClass('filter invert');
  });

  it('displays the toggle with the correct background color when accessibility mode is off', () => {
    render(<AccessibilityToggle checked={false} onChange={mockOnChange} />);
    const toggle = screen.getByRole('checkbox', { hidden: true }); // `hidden: true` allows us to query hidden inputs
    expect(toggle.nextSibling).toHaveClass('bg-gray-400'); // The span element with the background color
  });

  it('displays the toggle with the correct background color when accessibility mode is on', () => {
    (useAccessibilityContext as MockedFunction<typeof useAccessibilityContext>).mockReturnValue({
      isAccessibilityMode: true,
      toggleAccessibilityMode: mockToggleAccessibilityMode,
    });

    render(<AccessibilityToggle checked={true} onChange={mockOnChange} />);
    const toggle = screen.getByRole('checkbox', { hidden: true });
    expect(toggle.nextSibling).toHaveClass('bg-[#E4BF36]');
  });

  it('calls the toggleAccessibilityMode and onChange props when the toggle is clicked', async () => {
    render(<AccessibilityToggle checked={false} onChange={mockOnChange} />);
    const toggleLabel = screen.getByRole('checkbox', { hidden: true }).parentElement;

    await userEvent.click(toggleLabel!);
    await waitFor(() => {
      expect(mockToggleAccessibilityMode).toHaveBeenCalledTimes(1);
    });
  });

  it('displays the toggle knob at the correct position when accessibility mode is off', () => {
    render(<AccessibilityToggle checked={false} onChange={mockOnChange} />);
    const knob = screen.getByRole('checkbox', { hidden: true }).nextSibling?.firstChild;
    expect(knob).not.toHaveClass('translate-x-6');
  });

  it('displays the toggle knob at the correct position when accessibility mode is on', () => {
    (useAccessibilityContext as MockedFunction<typeof useAccessibilityContext>).mockReturnValue({
      isAccessibilityMode: true,
      toggleAccessibilityMode: mockToggleAccessibilityMode,
    });

    render(<AccessibilityToggle checked={true} onChange={mockOnChange} />);
    const knob = screen.getByRole('checkbox', { hidden: true }).nextSibling?.firstChild;
    expect(knob).toHaveClass('translate-x-6');
  });
});
