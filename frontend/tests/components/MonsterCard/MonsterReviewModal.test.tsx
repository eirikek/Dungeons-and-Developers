/*
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MonsterReviewModal from '../../../src/components/MonsterCard/MonsterReviewModal.tsx';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { GET_MONSTER_REVIEWS } from '../../../src/graphql/monsterQueries.ts';
import { ADD_REVIEW, UPDATE_REVIEW } from '../../../src/graphql/reviewQueries.ts';

export type Review = {
  id: string;
  user: {
    id: string;
    userName: string;
  };
  difficulty: number;
  description: string;
  createdAt: string;
};
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

const initialEmptyReviews: Review[] = [];
const mockReviewsUpdate: Review[] = [
  {
    id: 'review1',
    user: { id: mockUserId, userName: mockUsername },
    difficulty: 75,
    description: 'Updated review',
    createdAt: '2024-11-05T12:00:00Z',
  },
];

const mockReviewsAdd: Review[] = [
  {
    id: 'review1',
    user: { id: mockUserId, userName: mockUsername },
    difficulty: 50,
    description: 'New review',
    createdAt: '2024-11-05T12:00:00Z',
  },
];

// Apollo query mocks
const mocksForAddingReview = [
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: mockProps.monsterId },
    },
    result: {
      data: {
        monster: {
          reviews: initialEmptyReviews,
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
          reviews: mockReviewsAdd,
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
          reviews: mockReviewsAdd,
        },
      },
    },
  },
];

const mocksForUpdatingReview = [
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: mockProps.monsterId },
    },
    result: {
      data: {
        monster: {
          reviews: mockReviewsAdd,
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
          difficulty: 50,
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
          reviews: mockReviewsUpdate,
        },
      },
    },
  },
];

const renderComponent = (mocks: any) => {
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

  it('renders review button correctly', async () => {
    const { container } = renderComponent(mocksForAddingReview);
    const reviewButton = await screen.findByText('Review');
    expect(reviewButton).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('opens modal when review button is clicked', async () => {
    renderComponent(mocksForAddingReview);
    const user = userEvent.setup();

    const reviewButton = await screen.findByText('Review');
    expect(reviewButton).toBeInTheDocument();

    await user.click(reviewButton);

    expect(screen.getByText(`Review of ${mockProps.name}`)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProps.image);
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
  });

  it('shows 0 reviews when there are no reviews', async () => {
    renderComponent(mocksForAddingReview);
    const user = userEvent.setup();

    const reviewButton = await screen.findByText('Review');
    expect(reviewButton).toBeInTheDocument();

    await user.click(reviewButton);
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  it('handles submission of new review, and shows it', async () => {
    renderComponent(mocksForAddingReview);

    const user = userEvent.setup();

    const reviewButton = await screen.findByText('Review');
    expect(reviewButton).toBeInTheDocument();

    await user.click(reviewButton);

    await user.clear(screen.getByRole('textbox'));

    await user.type(screen.getByRole('textbox'), 'New review');

    await user.click(screen.getByRole('button', { name: 'Save-button' }));

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('New review');
    });
  });

  it('handles updating existing review', async () => {
    renderComponent(mocksForUpdatingReview);
    const user = userEvent.setup();

    const reviewButton = await screen.findByText('Review');
    expect(reviewButton).toBeInTheDocument();

    await user.click(reviewButton);
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('New review');
    });

    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Updated review');
    await user.click(screen.getByRole('button', { name: 'Save-button' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.click(reviewButton);
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Updated review');
    });
  });

  it('closes modal when cancel is clicked', async () => {
    renderComponent(mocksForAddingReview);
    const user = userEvent.setup();

    const reviewButton = await screen.findByText('Review');
    expect(reviewButton).toBeInTheDocument();

    await user.click(reviewButton);

    await user.click(reviewButton);

    const cancelButton = await screen.findByText('Cancel');
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it(
    'respects character limit for review description',
    async () => {
      renderComponent(mocksForAddingReview);
      const user = userEvent.setup();

      const reviewButton = await screen.findByText('Review');
      expect(reviewButton).toBeInTheDocument();

      await user.click(reviewButton);

      const longText = 'a'.repeat(301);
      await user.clear(screen.getByRole('textbox'));
      await user.type(screen.getByRole('textbox'), longText);

      expect(screen.getByRole('textbox')).toHaveValue('a'.repeat(300));
    },
    { timeout: 10000 }
  );

  it('resets form when modal is closed and re-opened', async () => {
    renderComponent(mocksForUpdatingReview);
    const user = userEvent.setup();

    const reviewButton = await screen.findByText('Review');
    expect(reviewButton).toBeInTheDocument();

    await user.click(reviewButton);
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Temporary review');
    await user.click(screen.getByText('Cancel'));

    await user.click(screen.getByText('Review'));

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('New review');
    });
  });
});
*/
