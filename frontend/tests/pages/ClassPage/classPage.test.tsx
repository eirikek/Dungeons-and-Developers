import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect } from 'vitest';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import ClassPage from '../../../src/pages/subPages/classPage.tsx';
import { GET_CLASSES } from '../../../src/graphql/classQueries.ts';
import { GET_USER_CLASS } from '../../../src/graphql/userQueries.ts';
import { UPDATE_USER_CLASS } from '../../../src/graphql/updateUserQueries.ts';

const mockShowToast = vi.fn();

vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

vi.mock('react-responsive', () => ({
  useMediaQuery: () => true, // or false, depending on your needs
}));

const mockUserId = '1';
const mockToken = 'mock-token';
const mockUserName = 'Mock User';

const mockClasses = [
  {
    id: '1',
    index: 'barbarian',
    name: 'Barbarian',
    hit_die: 12,
    skills: [{ name: 'Athletics' }, { name: 'Survival' }],
  },
  {
    id: '2',
    index: 'bard',
    name: 'Bard',
    hit_die: 8,
    skills: [{ name: 'Performance' }, { name: 'Acrobatics' }],
  },
];

const mocks: MockedResponse[] = [
  // Mock for GET_CLASSES
  {
    request: {
      query: GET_CLASSES,
      variables: { offset: 0, limit: 12 },
    },
    result: {
      data: {
        classes: {
          classes: mockClasses,
          totalClasses: mockClasses.length,
        },
      },
    },
  },

  {
    request: {
      query: GET_USER_CLASS,
      variables: { userId: mockUserId },
    },
    result: {
      data: {
        user: {
          id: mockUserId,
          class: mockClasses[0],
        },
      },
    },
  },
];

describe('Classpage component', () => {
  const renderComponent = (additionalMocks: MockedResponse[] = []) => {
    return render(
      <MockedProvider mocks={[...additionalMocks, ...mocks]} addTypename={false}>
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
            <ClassPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );
  };

  it.skip('renders correctly and matches snapshot', async () => {
    renderComponent();

    await waitFor(() => expect(screen.getByText('Barbarian')).toBeInTheDocument());

    const mainSection = screen.getByRole('main');
    expect(mainSection).toMatchSnapshot();
  });

  it.skip('displays loading state', async () => {
    const loadingMocks = [
      {
        request: {
          query: GET_CLASSES,
          variables: { offset: 0, limit: 12 },
        },
        result: {
          data: null,
        },
        delay: 1000, // test delay
      },
    ];

    renderComponent(loadingMocks);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it.skip('displays error state', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errorMocks = [
      {
        request: {
          query: GET_CLASSES,
          variables: { offset: 0, limit: 12 },
        },
        error: new GraphQLError('Error fetching classes'),
      },
      {
        request: {
          query: GET_USER_CLASS,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              class: null,
            },
          },
        },
      },
    ];

    renderComponent(errorMocks);
    await waitFor(() => {
      expect(screen.getByText('Error loading classes.')).toBeInTheDocument();
    });

    consoleErrorMock.mockRestore();
  });
  it.skip('updates selected class when a class is clicked', async () => {
    const user = userEvent.setup();

    const userClassMocks = [
      {
        request: {
          query: GET_USER_CLASS,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              class: null,
            },
          },
        },
      },
      {
        request: {
          query: UPDATE_USER_CLASS,
          variables: { userId: mockUserId, classId: mockClasses[1].id },
        },
        result: {
          data: {
            updateUserClass: {
              id: mockUserId,
              class: mockClasses[1],
            },
          },
        },
      },
    ];

    renderComponent(userClassMocks);

    await waitFor(() => expect(screen.getByText('Barbarian')).toBeInTheDocument());
    const bardCard = (await screen.findByText('Bard')).closest('section') as HTMLElement;
    expect(bardCard).toBeInTheDocument();

    const checkBoxButton = await within(bardCard).findByRole('checkbox');

    await waitFor(() => expect(checkBoxButton).toBeInTheDocument());

    await user.click(checkBoxButton);

    await waitFor(() => {
      expect(checkBoxButton).toBeChecked();
    });
  });
  it.skip('class is already selected', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText('Barbarian')).toBeInTheDocument());
    const barbarianCard = (await screen.findByText('Barbarian')).closest('section') as HTMLElement;

    expect(barbarianCard).toBeInTheDocument();

    const checkBox = await within(barbarianCard).findByRole('checkbox');

    await waitFor(() => expect(checkBox).toBeChecked());
  });
});
