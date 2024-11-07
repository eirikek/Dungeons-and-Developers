import { describe } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import AppProviders from '../../../src/components/AppProviders/AppProviders.tsx';
import { MockedProvider } from '@apollo/client/testing';
import { GET_USER_FAVORITES } from '../../../../backend/src/graphql/queries.ts';

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
          favoritedMonsters: [],
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
      expect(getByText('Test child')).toBeInTheDocument();
    });
  });
});
