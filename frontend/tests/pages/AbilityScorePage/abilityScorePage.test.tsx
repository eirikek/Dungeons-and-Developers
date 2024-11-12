import { MockedProvider } from '@apollo/client/testing';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { GET_ABILITYSCORES, GET_ARRAY_SCORES, UPDATE_ABILITY_SCORES } from '../../../src/graphql/queries.ts';
import AbilityScorePage from '../../../src/pages/subPages/abilityScorePage.tsx';

import { BrowserRouter } from 'react-router-dom';
import { afterEach, vi } from 'vitest';

// Mock the useToast hook
const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Mock data for GraphQL queries
const mocks = [
  {
    request: {
      query: GET_ARRAY_SCORES,
      variables: { userId: '1' },
    },
    result: {
      data: {
        getArrayScores: [10, 12, 14, 8, 15, 9],
      },
    },
  },
  {
    request: {
      query: UPDATE_ABILITY_SCORES,
      variables: { userId: '1', scores: [10, 12, 14, 8, 15, 9] },
    },
    result: {
      data: {
        updateAbilityScores: true,
      },
    },
  },
  {
    request: {
      query: GET_ABILITYSCORES, // Add GET_ABILITYSCORES here
      variables: { offset: 0, limit: 6 },
    },
    result: {
      data: {
        abilities: {
          abilities: [
            { index: 1, name: 'Strength', skills: ['Athletics'] },
            { index: 2, name: 'Dexterity', skills: ['Acrobatics', 'Stealth'] },
            { index: 3, name: 'Constitution', skills: [] },
            { index: 4, name: 'Intelligence', skills: ['Investigation'] },
            { index: 5, name: 'Wisdom', skills: ['Insight', 'Perception'] },
            { index: 6, name: 'Charisma', skills: ['Persuasion'] },
          ],
          totalAbilities: 6,
        },
      },
    },
  },
];

// Test Suite
describe('AbilityScorePage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const userId = '1';
  const token = 'mock-token'; // Mock token
  const userName = 'Mock User'; // Mock user name
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false} defaultOptions={{ watchQuery: { fetchPolicy: 'no-cache' } }}>
        <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
          <BrowserRouter>
            <AbilityScorePage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders ability scores after loading', async () => {
    vi.useRealTimers();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
          <BrowserRouter>
            <AbilityScorePage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBe(6);
    });

    expect(screen.getAllByText('Skills required:')).toMatchSnapshot();
  });

  it('updates ability score on user interaction', async () => {
    vi.useRealTimers();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId, token, userName, login: vi.fn(), logout: vi.fn() }}>
          <BrowserRouter>
            <AbilityScorePage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Skills required:')).toHaveLength(6);
    });
    await waitFor(() => {
      expect(screen.getAllByLabelText('ability score value')[0]).toHaveTextContent('10');
    });

    vi.useFakeTimers();

    const incrementButton = screen.getAllByLabelText('Increment')[0];
    fireEvent.mouseDown(incrementButton);
    act(() => {
      vi.advanceTimersByTime(300);
    });

    fireEvent.mouseUp(incrementButton);
    vi.useRealTimers();

    await waitFor(() => {
      expect(screen.getAllByLabelText('ability score value')[0]).toHaveTextContent('13');
    });
  });
});
