import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import { GET_USER_DUNGEON_NAME, GET_USER_FAVORITES } from '../../../src/graphql/queries/userQueries';
import AppProviders from '../../../src/components/AppProviders/AppProviders';
import { AuthContext } from '../../../src/context/AuthContext';

const mockAuthContextValue = { userId: '12345', userName: 'Bob', token: '32', login: vi.fn(), logout: vi.fn() };
const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const mocks = [
  {
    request: {
      query: GET_USER_FAVORITES,
      variables: { userId: mockAuthContextValue.userId },
    },
    result: {
      data: {
        user: {
          id: '123',
          favoritedMonsters: [],
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_DUNGEON_NAME,
      variables: { userId: mockAuthContextValue.userId },
    },
    result: {
      data: {
        user: {
          dungeonName: 'Some Dungeon',
        },
      },
    },
  },
];

describe('AppProviders', () => {
  it('Renders with correct values', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <AppProviders>
            <div>Test child</div>
          </AppProviders>
        </AuthContext.Provider>
      </MockedProvider>
    );
    waitFor(() => {
      const testChild = screen.getByText('Test child');
      expect(testChild).toBeTruthy();
    });
  });
});
