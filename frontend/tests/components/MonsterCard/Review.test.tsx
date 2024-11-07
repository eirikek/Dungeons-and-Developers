import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import Review from '../../../src/components/MonsterCard/Review.tsx';
import { DELETE_REVIEW, UPDATE_REVIEW, GET_MONSTER_REVIEWS } from '../../../../backend/src/graphql/queries';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { ReviewType } from '../../../src/interfaces/ReviewProps';

// Mock useToast
vi.mock('../../../src/hooks/useToast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

const mockReview: ReviewType = {
  id: 'review-123',
  user: { id: 'user-123', userName: 'Test User' },
  difficulty: 50,
  description: 'This is a test review.',
  createdAt: '2024-11-08T12:00:00Z',
};

const mockMonsterId = 'monster-456';
const mockMonsterName = 'Test Monster';

const mockUserId = 'user-123';
const mockToken = 'mock-token';
const mockUsername = 'Test User';
const mockLogin = vi.fn();
const mockLogout = vi.fn();

const mocks = [
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: mockMonsterId },
    },
    result: {
      data: {
        monster: {
          reviews: [mockReview],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_REVIEW,
      variables: { monsterId: mockMonsterId, reviewId: mockReview.id },
    },
    result: {
      data: {
        deleteReview: {
          reviews: [],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_REVIEW,
      variables: {
        monsterId: mockMonsterId,
        reviewId: mockReview.id,
        review: {
          user: mockUserId,
          difficulty: 60,
          description: 'Updated test review.',
        },
      },
    },
    result: {
      data: {
        updateReview: {
          ...mockReview,
          difficulty: 60,
          description: 'Updated test review.',
        },
      },
    },
  },
  // Add more mocks for ADD_REVIEW if needed
];

const renderComponent = () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthContext.Provider
        value={{
          userId: mockUserId,
          userName: mockUsername,
          logout: mockLogout,
          login: mockLogin,
          token: mockToken,
        }}
      >
        <Review review={mockReview} monsterId={mockMonsterId} monsterName={mockMonsterName} />
      </AuthContext.Provider>
    </MockedProvider>
  );
};

describe('Review Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders review content correctly', async () => {
    renderComponent();

    expect(screen.getByText(mockReview.user.userName)).toBeInTheDocument();
    expect(screen.getByText(`Difficulty: ${mockReview.difficulty}`)).toBeInTheDocument();
    expect(screen.getByText(mockReview.description)).toBeInTheDocument();
  });

  it('allows user to edit and save review', async () => {
    renderComponent();
    const user = userEvent.setup();

    // Click the edit button
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Update difficulty and description
    const newDifficulty = 70;
    const newDescription = 'This is an updated review.';

    const slider = screen.getByRole('slider');
    await user.type(slider, `${newDifficulty}`);

    const textField = screen.getByRole('textbox');
    await user.clear(textField);
    await user.type(textField, newDescription);

    // Click the save button
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Assertions
    await waitFor(() => {
      expect(screen.getByText(`Difficulty: ${newDifficulty}`)).toBeInTheDocument();
      expect(screen.getByText(newDescription)).toBeInTheDocument();
    });
  });

  it('allows user to delete review', async () => {
    renderComponent();
    const user = userEvent.setup();

    // Click the delete button
    await user.click(screen.getByRole('button', { name: /delete/i }));

    // Assertions
    await waitFor(() => {
      expect(screen.queryByText(mockReview.description)).not.toBeInTheDocument();
    });
  });

  // Add more tests for undo functionality and edge cases
});
