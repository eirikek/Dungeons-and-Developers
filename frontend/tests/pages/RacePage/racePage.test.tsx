import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import RacePage from '../../../src/pages/subPages/racePage.tsx';
import { GET_RACES } from '../../../src/graphql/raceQueries.ts';
import { GET_USER_RACE } from '../../../src/graphql/userQueries.ts';
import { UPDATE_USER_RACE } from '../../../src/graphql/updateUserQueries.ts';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

vi.mock('react-responsive', () => ({
  useMediaQuery: () => true, // Adjust as needed
}));

const mockUserId = '1';
const mockToken = 'mock-token';
const mockUserName = 'Mock User';

const mockRaces = [
  {
    id: '1',
    index: 'human',
    name: 'Human',
    speed: 30,
    alignment: 'Any alignment',
    size: 'Medium',
    img: 'human.png',
  },
  {
    id: '2',
    index: 'elf',
    name: 'Elf',
    speed: 30,
    alignment: 'Chaotic Good',
    size: 'Medium',
    img: 'elf.png',
  },
];

const defaultMocks: MockedResponse[] = [
  {
    request: {
      query: GET_RACES,
      variables: { offset: 0, limit: 9 },
    },
    result: {
      data: {
        races: {
          races: mockRaces,
          totalRaces: mockRaces.length,
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_RACE,
      variables: { userId: mockUserId },
    },
    result: {
      data: {
        user: {
          id: mockUserId,
          race: mockRaces[0],
        },
      },
    },
  },
];

describe('RacePage component', () => {
  const renderComponent = (additionalMocks: MockedResponse[] = []) => {
    return render(
      <MockedProvider mocks={[...additionalMocks, ...defaultMocks]} addTypename={false}>
        <AuthContext.Provider
          value={{
            userId: mockUserId,
            token: mockToken,
            userName: mockUserName,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <BrowserRouter>
            <RacePage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );
  };

  it('renders correctly and matches snapshot', async () => {
    renderComponent();

    await waitFor(() => expect(screen.getByText('Human')).toBeInTheDocument());

    const mainSection = screen.getByRole('main');
    expect(mainSection).toMatchSnapshot();
  });

  it('displays loading state', async () => {
    const loadingMocks = [
      {
        request: {
          query: GET_RACES,
          variables: { offset: 0, limit: 9 },
        },
        result: {},
        delay: 1000,
      },
      {
        request: {
          query: GET_USER_RACE,
          variables: { userId: mockUserId },
        },
        result: {},
        delay: 1000,
      },
    ];

    renderComponent(loadingMocks);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errorMocks = [
      {
        request: {
          query: GET_RACES,
          variables: { offset: 0, limit: 9 },
        },
        error: new GraphQLError('Failed to fetch races'),
      },
      {
        request: {
          query: GET_USER_RACE,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              race: null,
            },
          },
        },
      },
    ];

    renderComponent(errorMocks);

    await waitFor(() => {
      expect(screen.getByText('Error loading races.')).toBeInTheDocument();
    });
    consoleErrorMock.mockRestore();
  });

  it('updates selected race when a race is clicked', async () => {
    const user = userEvent.setup();

    const userRaceMocks = [
      {
        request: {
          query: GET_USER_RACE,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              race: null,
            },
          },
        },
      },
      {
        request: {
          query: UPDATE_USER_RACE,
          variables: { userId: mockUserId, raceId: mockRaces[1].id },
        },
        result: {
          data: {
            updateUserRace: {
              id: mockUserId,
              race: mockRaces[1],
            },
          },
        },
      },
    ];

    renderComponent(userRaceMocks);

    await waitFor(() => expect(screen.getByText('Human')).toBeInTheDocument());

    const elfCard = (await screen.findByText('Elf')).closest('section') as HTMLElement;
    expect(elfCard).toBeInTheDocument();

    const checkBoxButton = await within(elfCard).findByRole('checkbox');

    await user.click(checkBoxButton);

    await waitFor(() => {
      expect(checkBoxButton).toBeChecked();
    });

    // Verify that the toast was shown
    expect(mockShowToast).toHaveBeenCalledWith({
      message: 'Race changed to Elf',
      type: 'success',
      duration: 3000,
    });
  });

  it('race is already selected', async () => {
    renderComponent();

    await waitFor(() => expect(screen.getByText('Human')).toBeInTheDocument());

    const humanCard = (await screen.findByText('Human')).closest('section') as HTMLElement;

    expect(humanCard).toBeInTheDocument();

    const checkBox = await within(humanCard).findByRole('checkbox');

    expect(checkBox).toBeChecked();
  });
});
