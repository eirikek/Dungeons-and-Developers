/*import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MonsterDetailsModal from '../../../src/components/MonsterCard/MonsterDetailsModal.tsx';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { Review } from './MonsterReviewModal.test.tsx';
import { GET_MONSTER_REVIEWS } from '../../../src/graphql/monsterQueries.ts';

const mockProps = {
  id: 'monster-123',
  name: 'Goblin',
  hit_points: 30,
  type: 'Beast',
  image: 'goblin.jpg',
  onClose: vi.fn(),
};

vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

const mockUserId = 'user-123';
const mockToken = 'mock-token';
const mockUsername = 'Alice';
const mockLogin = vi.fn();
const mockLogout = vi.fn();

const mockReviews: Review[] = [
  {
    id: 'review-1',
    user: { id: mockUserId, userName: mockUsername },
    difficulty: 4,
    description: 'This monster was tough!',
    createdAt: '2024-11-06T08:00:00Z',
  },
  {
    id: 'review-2',
    user: { id: 'user-456', userName: 'Bob' },
    difficulty: 3,
    description: 'A challenging but fair fight.',
    createdAt: '2024-11-05T12:00:00Z',
  },
];

const mocks = [
  {
    request: {
      query: GET_MONSTER_REVIEWS,
      variables: { monsterId: mockProps.id },
    },
    result: {
      data: {
        id: '1',
        monster: {
          id: 'monster-123',
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
        <MonsterDetailsModal {...mockProps} />
      </AuthContext.Provider>
    </MockedProvider>
  );
};

describe('MonsterDetailsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', async () => {
    const { container } = renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('displays monster information correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('src', mockProps.image);
      expect(screen.getByRole('img')).toHaveAttribute('alt', mockProps.name);
      expect(screen.getByText(mockProps.name)).toBeInTheDocument();
      expect(screen.getByText(`Type: ${mockProps.type}`)).toBeInTheDocument();
      expect(screen.getByText(`HP: ${mockProps.hit_points}`)).toBeInTheDocument();
    });
  });

  it('displays reviews correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Reviews')).toBeInTheDocument();
      expect(screen.getByText('This monster was tough!')).toBeInTheDocument();
      expect(screen.getByText('A challenging but fair fight.')).toBeInTheDocument();
    });
  });

  it('calculates and displays average difficulty', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Average Difficulty: 3.5')).toBeInTheDocument();
    });
  });

  it('displays "No reviews yet." when there are no reviews', async () => {
    const noReviewsMocks = [
      {
        request: {
          query: GET_MONSTER_REVIEWS,
          variables: { monsterId: mockProps.id },
        },
        result: {
          data: {
            id: '1',
            monster: {
              id: 'monster-123',
              reviews: [], // No reviews
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={noReviewsMocks} addTypename={false}>
        <AuthContext.Provider
          value={{ userId: mockUserId, userName: mockUsername, logout: mockLogout, login: mockLogin, token: mockToken }}
        >
          <MonsterDetailsModal {...mockProps} />
        </AuthContext.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });
  });

  it('calls onClose function when Close button is clicked', async () => {
    renderComponent();
    const user = userEvent.setup();

    await waitFor(() => {
      user.click(screen.getByRole('button', { name: 'Close modal' }));
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });
  });
});
*/
