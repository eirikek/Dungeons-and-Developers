import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import MonsterReviewModal from '../../../src/components/MonsterCard/MonsterReviewModal.tsx';
import { ADD_REVIEW, GET_MONSTER_REVIEWS, UPDATE_REVIEW } from '../../../../backend/src/graphql/queries';
import { AuthContext } from '../../../src/context/AuthContext.tsx';

// Mock the useToast hook
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

const mockProps = {
  name: 'Dragon',
  monsterId: '123',
  image: 'dragon.jpg',
};

const mockUserId = 'user123';
const mockToken = 'mock-token';
const mockUsername = 'bob';
const mockLogin = vi.fn();
const mockLogout = vi.fn();

const mockReviews = [
  {
    id: 'review1',
    user: { id: mockUserId, userName: mockUsername },
    difficulty: 75,
    description: 'Existing review',
    createdAt: '2024-11-05T12:00:00Z',
  },
];

// Apollo query mocks
const mocks = [
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: mockProps.monsterId },
    },
    result: {
      data: {
        monster: {
          reviews: mockReviews,
        },
      },
    },
  },
  {
    request: {
      query: ADD_REVIEW,
      variables: {
        monsterId: mockProps.monsterId,
        review: {
          user: mockUserId,
          difficulty: 50,
          description: 'New review',
        },
      },
    },
    result: {
      data: {
        addReview: {
          reviews: [
            {
              user: {
                id: mockUserId,
                userName: mockUsername,
              },
              difficulty: 50,
              description: 'New review',
              createdAt: '2024-11-06T08:00:00Z',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_REVIEW,
      variables: {
        monsterId: mockProps.monsterId,
        reviewId: 'review1',
        review: {
          user: mockUserId,
          difficulty: 75,
          description: 'Updated review',
        },
      },
    },
    result: {
      data: {
        updateReview: {
          id: 'review1',
          user: {
            id: mockUserId,
            userName: mockUsername,
          },
          difficulty: 75,
          description: 'Updated review',
          createdAt: '2024-11-06T08:00:00Z',
        },
      },
    },
  },
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: mockProps.monsterId },
    },
    result: {
      data: {
        monster: {
          reviews: mockReviews,
        },
      },
    },
  },
];

const renderComponent = () => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthContext.Provider
        value={{ userId: mockUserId, userName: mockUsername, logout: mockLogout, login: mockLogin, token: mockToken }}
      >
        <MonsterReviewModal {...mockProps} />
      </AuthContext.Provider>
    </MockedProvider>
  );
};

describe('MonsterReviewModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders review button correctly', () => {
    const { container } = renderComponent();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('opens modal when review button is clicked', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByText('Review'));

    expect(screen.getByText(`Review of ${mockProps.name}`)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProps.image);
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
  });

  it('shows existing review data for user who has already reviewed', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByText('Review'));

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Existing review');
    });
  });

  it('handles submission of new review', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider
          value={{ userId: mockUserId, token: 'user124', login: mockLogin, logout: mockLogout, userName: mockUsername }}
        >
          <MonsterReviewModal {...mockProps} />
        </AuthContext.Provider>
      </MockedProvider>
    );

    const user = userEvent.setup();

    await user.click(screen.getByText('Review'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'New review');
    await user.click(screen.getByRole('button', { name: 'Save-button' }));

    expect(container).toMatchSnapshot();
  });

  it('handles updating existing review', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByText('Review'));
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Existing review');
    });

    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Updated review');
    await user.click(screen.getByRole('button', { name: 'Save-button' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal when cancel is clicked', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByText('Review'));
    await user.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it(
    'handles character limit in description',
    async () => {
      renderComponent();
      const user = userEvent.setup();

      await user.click(screen.getByText('Review'));

      const longText = 'a'.repeat(301);
      await user.clear(screen.getByRole('textbox'));
      await user.type(screen.getByRole('textbox'), longText);

      expect(screen.getByRole('textbox')).toHaveValue('a'.repeat(300));
    },
    { timeout: 10000 }
  );

  it('resets form when modal is closed', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByText('Review'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Test review');
    await user.click(screen.getByText('Cancel'));

    await user.click(screen.getByText('Review'));

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Existing review');
    });
  });
});
