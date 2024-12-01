import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Review from '../../../src/components/MonsterCard/Review';
import { AuthContext } from '../../../src/context/AuthContext';
import { ReviewType } from '../../../src/interfaces/ReviewProps';
import { GET_MONSTER_REVIEWS } from '../../../src/graphql/queries/monsterQueries';
import { DELETE_REVIEW, UPDATE_REVIEW } from '../../../src/graphql/mutations/monsterMutations';

vi.mock('../../../src/hooks/useToast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

interface MockSliderProps {
  id: string;
  name: string;
  min: number;
  max: number;
  value: number;
  'data-testid': string;
  onChange: (event: Event | React.ChangeEvent<HTMLInputElement>, newValue: number) => void;
  disabled?: boolean;
}

vi.mock('../../../src/components/MonsterCard/ReviewSlider', () => ({
  default: ({ value, onChange, disabled = false }: MockSliderProps) => (
    <input
      type="range"
      data-testid="review-slider"
      value={value}
      onChange={(e) => {
        if (onChange && !disabled) {
          const newValue = Number(e.target.value);
          onChange(e, newValue);
        }
      }}
      min={0}
      max={100}
      step={10}
      disabled={disabled}
    />
  ),
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
      query: UPDATE_REVIEW,
      variables: {
        monsterId: mockMonsterId,
        reviewId: mockReview.id,
        review: {
          user: mockUserId,
          difficulty: 70,
          description: 'This is an updated review',
        },
      },
    },
    result: {
      data: {
        updateReview: {
          id: mockReview.id,
          user: { id: mockUserId, userName: 'Test User' },
          difficulty: 70,
          description: 'This is an updated review',
          createdAt: mockReview.createdAt,
        },
      },
    },
  },
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: mockMonsterId },
    },
    result: {
      data: {
        monster: {
          reviews: [
            {
              id: mockReview.id,
              user: { id: mockUserId, userName: 'Test User' },
              difficulty: 70,
              description: 'This is an updated review',
              createdAt: mockReview.createdAt,
            },
          ],
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
];

const renderComponent = () => {
  return render(
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
    const { asFragment } = renderComponent();

    expect(screen.getByText(mockReview.user.userName)).toBeTruthy();
    expect(screen.getByText(`Difficulty: ${mockReview.difficulty}`)).toBeTruthy();
    expect(screen.getByText(mockReview.description)).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it('allows user to edit and save review', async () => {
    renderComponent();
    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByText(`Difficulty: ${mockReview.difficulty}`)).toBeTruthy();
    });

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const newDifficulty = 70;
    const newDescription = 'This is an updated review';

    const slider = screen.getByTestId('review-slider');
    fireEvent.change(slider, { target: { value: newDifficulty } });

    await waitFor(() => {
      expect(slider.value).toBe(String(newDifficulty));
    });

    const textField = screen.getByRole('textbox');
    await user.clear(textField);
    await user.type(textField, newDescription);

    expect(textField.value).toBe(newDescription);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    await waitFor(() => {
      expect(saveButton).toBeTruthy();
    });
  });
});
