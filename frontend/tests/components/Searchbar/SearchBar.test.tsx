import { render, screen } from '@testing-library/react';
import SearchBar from '../../../src/components/SearchBar/SearchBar.tsx';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';

describe('Searchbar component', () => {
  const defaultPlaceholder = 'Search for a monster...';

  const initialSearchTerm = 'Dragon';
  const handleSearchChangeMock = vi.fn();
  it('renders correctly with default placeholder and search term', () => {
    render(<SearchBar searchTerm={initialSearchTerm} handleSearchChange={handleSearchChangeMock} />);
    const inputElement = screen.getByPlaceholderText(defaultPlaceholder);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(initialSearchTerm);
  });

  it('calls handleSearchChange on input change', async () => {
    const user = userEvent.setup();
    render(<SearchBar searchTerm="" handleSearchChange={handleSearchChangeMock} />);
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
      return <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />;
    };
    render(<WrapperComponent />);
    const inputElement = screen.getByPlaceholderText(defaultPlaceholder);

    await user.type(inputElement, 'Orc');
    expect(inputElement).toHaveValue('Orc');
  });
  it('renders the search icon', () => {
    const { container } = render(
      <SearchBar searchTerm={initialSearchTerm} handleSearchChange={handleSearchChangeMock} />
    );
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
  it('matches snapshot', () => {
    const { container } = render(
      <SearchBar searchTerm={initialSearchTerm} handleSearchChange={handleSearchChangeMock} />
    );
    expect(container).toMatchSnapshot();
  });
});
