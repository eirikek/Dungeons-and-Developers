import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomButton from '../../../src/components/CustomButton/CustomButton.tsx';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

describe('CustomButton', () => {
  it('renders correctly as a button and matches snapshot', () => {
    const { container } = render(<CustomButton text="Click me" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly as a Link and matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <CustomButton text="Go Home" linkTo="/home" />
      </MemoryRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<CustomButton text="Click me" onClick={handleClick} />);
    const button = screen.getByText(/Click me/i);

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with custom className and children', () => {
    render(
      <CustomButton text="Click me" className="custom-class">
        <span>Child Element</span>
      </CustomButton>
    );

    const button = screen.getByText(/Click me/i);
    expect(button).toHaveClass('custom-class');
    expect(screen.getByText(/Child Element/i)).toBeInTheDocument();
  });

  it('renders an active button with underline', () => {
    render(<CustomButton text="Active" isActive />);
    const button = screen.getByText(/Active/i);
    expect(button).toHaveClass('bold');
  });

  it('handles focus and blur events', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<CustomButton text="Focus Test" onFocus={handleFocus} onBlur={handleBlur} />);

    const button = screen.getByText(/Focus Test/i);
    await userEvent.tab(); // Simulate focus
    expect(handleFocus).toHaveBeenCalledTimes(1);

    await userEvent.tab(); // Simulate blur
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('navigates correctly when used as a Link', () => {
    render(
      <MemoryRouter>
        <CustomButton text="Go to Page" linkTo="/page" />
      </MemoryRouter>
    );

    const link = screen.getByText(/Go to Page/i);
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/page');
  });
});
