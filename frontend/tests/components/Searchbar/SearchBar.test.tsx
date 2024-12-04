import { render, screen } from '@testing-library/react';
import SearchBar from '../../../src/components/SearchBar/SearchBar';
import { expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

describe('Searchbar component', () => {
  const defaultPlaceholder = 'Search for a monster...';

  const initialSearchTerm = 'Dragon';
  const handleSearchChangeMock = vi.fn();
  const mockOnSuggestionClick = vi.fn();
  const mockSuggestions = ['giant', 'dragon'];
  it('renders correctly with default placeholder and search term', () => {
    render(
      <SearchBar
        searchTerm={initialSearchTerm}
        handleSearchChange={handleSearchChangeMock}
        onSuggestionClick={mockOnSuggestionClick}
        suggestions={mockSuggestions}
      />
    );
    const inputElement = screen.getByPlaceholderText(defaultPlaceholder) as HTMLInputElement;
    expect(inputElement).toBeTruthy();
    expect(inputElement.value).toBe(initialSearchTerm);
  });

  it('calls handleSearchChange on input change', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        searchTerm=""
        handleSearchChange={handleSearchChangeMock}
        onSuggestionClick={mockOnSuggestionClick}
        suggestions={mockSuggestions}
      />
    );
    const inputElement = screen.getByPlaceholderText(defaultPlaceholder);
    await user.type(inputElement, 'Goblin');
    expect(handleSearchChangeMock).toHaveBeenCalledTimes(6);
  });
  it('updates input value as user types', async () => {
    const user = userEvent.setup();

    const WrapperComponent = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      };
      return (
        <SearchBar
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          onSuggestionClick={mockOnSuggestionClick}
          suggestions={mockSuggestions}
        />
      );
    };
    render(<WrapperComponent />);
    const inputElement = screen.getByPlaceholderText(defaultPlaceholder) as HTMLInputElement;

    await user.type(inputElement, 'Orc');
    expect(inputElement.value).toBe('Orc');
  });
  it('renders the search icon', () => {
    const { container } = render(
      <SearchBar
        searchTerm={initialSearchTerm}
        handleSearchChange={handleSearchChangeMock}
        onSuggestionClick={mockOnSuggestionClick}
        suggestions={mockSuggestions}
      />
    );
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeTruthy();
  });
  it('matches snapshot', () => {
    const { container } = render(
      <SearchBar
        searchTerm={initialSearchTerm}
        handleSearchChange={handleSearchChangeMock}
        onSuggestionClick={mockOnSuggestionClick}
        suggestions={mockSuggestions}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
