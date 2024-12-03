import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { useLocation } from 'react-router-dom';
import { useAccessibility } from '../../../src/context/AccessibilityContext.tsx';
import AccessibilityToggle from '../../../src/components/AccessibilityToggle/AccessibilityToggle.tsx';

// Mock the AccessibilityContext hook
vi.mock('../../../src/context/AccessibilityContext.tsx', () => ({
  useAccessibility: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

describe('AccessibilityToggle', () => {
  const mockToggleAccessibilityMode = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    // Typecast useAccessibility to a mocked function
    (useAccessibility as MockedFunction<typeof useAccessibility>).mockReturnValue({
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
    const { container } = render(<AccessibilityToggle />);
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

    render(<AccessibilityToggle />);

    const icon = screen.getByAltText(/accessability icon/i);
    expect(icon).toHaveClass('filter invert');
  });

  it('displays the icon without inverted filter on other pages', () => {
    render(<AccessibilityToggle />);

    const icon = screen.getByAltText(/accessability icon/i);
    expect(icon).not.toHaveClass('filter invert');
  });

  it('displays the toggle with the correct background color when accessibility mode is off', () => {
    render(<AccessibilityToggle />);
    const toggle = screen.getByRole('checkbox', { hidden: true }); // `hidden: true` allows us to query hidden inputs
    expect(toggle.nextSibling).toHaveClass('bg-gray-400'); // The span element with the background color
  });

  it('displays the toggle with the correct background color when accessibility mode is on', () => {
    (useAccessibility as MockedFunction<typeof useAccessibility>).mockReturnValue({
      isAccessibilityMode: true,
      toggleAccessibilityMode: mockToggleAccessibilityMode,
    });

    render(<AccessibilityToggle />);
    const toggle = screen.getByRole('checkbox', { hidden: true });
    expect(toggle.nextSibling).toHaveClass('bg-[#E4BF36]');
  });

  it('handles toggle switch change', async () => {
    render(<AccessibilityToggle />);
    const toggle = screen.getByRole('checkbox', { hidden: true });

    await userEvent.click(toggle);
    expect(mockToggleAccessibilityMode).toHaveBeenCalledTimes(1);
  });

  it('displays the toggle knob at the correct position when accessibility mode is off', () => {
    render(<AccessibilityToggle />);
    const knob = screen.getByRole('checkbox', { hidden: true }).nextSibling?.firstChild;
    expect(knob).not.toHaveClass('translate-x-6');
  });

  it('displays the toggle knob at the correct position when accessibility mode is on', () => {
    (useAccessibility as MockedFunction<typeof useAccessibility>).mockReturnValue({
      isAccessibilityMode: true,
      toggleAccessibilityMode: mockToggleAccessibilityMode,
    });

    render(<AccessibilityToggle />);
    const knob = screen.getByRole('checkbox', { hidden: true }).nextSibling?.firstChild;
    expect(knob).toHaveClass('translate-x-6');
  });
});
