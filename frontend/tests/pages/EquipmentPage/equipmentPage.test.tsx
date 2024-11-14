import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import EquipmentPage from '../../../src/pages/subPages/equipmentPage.tsx';
import {
  ADD_EQUIPMENT_TO_CHARACTER,
  GET_USER_EQUIPMENT,
  REMOVE_ALL_EQUIPMENTS,
  REMOVE_EQUIPMENT_FROM_CHARACTER,
} from '../../../src/graphql/queries.ts';
import { AuthContext } from '../../../src/context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { GET_EQUIPMENTS } from '../../../src/hooks/useEquipments.ts';
import { expect } from 'vitest';

const mockShowToast = vi.fn();
vi.mock('../../../src/hooks/useToast.ts', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const helmetEquipment = { id: '1', index: '1', name: 'Helmet', category: 'Headgear', value: 4 };

const mockEquipments = [
  helmetEquipment,
  ...Array.from({ length: 39 }, (_, index) => ({
    id: `${index + 2}`,
    index: `${index + 2}`,
    name: `Equipment ${index + 2}`,
    category: 'Category',
    value: 5,
  })),
];

const mockUserId = '1';
const mockToken = 'mock-token'; // Mock token
const mockUserName = 'Mock User'; // Mock user name

describe('EquipmentPage', () => {
  it('renders correctly and matches snapshot', async () => {
    const mocks = [
      {
        request: {
          query: GET_EQUIPMENTS,
          variables: { offset: 0, limit: 20 },
        },
        result: {
          data: {
            equipments: {
              equipments: mockEquipments.slice(0, 20),
              totalCount: 40,
            },
          },
        },
      },

      {
        request: {
          query: GET_USER_EQUIPMENT,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              equipments: [helmetEquipment],
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
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
            <EquipmentPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Equipments')).toBeInTheDocument();
    });
    expect(screen.queryByText('No equipments available')).toBeNull();

    expect(screen.getByRole('main')).toMatchSnapshot();

    const equipmentCardHeading = await screen.findByText('Helmet');
    const equipmentCard = equipmentCardHeading.closest('section') as HTMLElement;
    expect(equipmentCard).toBeInTheDocument();

    const checkbox = await within(equipmentCard).findByRole('checkbox');

    await waitFor(() => expect(checkbox).toBeInTheDocument());
  });

  it('handles adding an equipment to user equipments', async () => {
    const user = userEvent.setup();
    const mockUserEquipments: never[] = []; // User starts with no equipments

    const mocks = [
      {
        request: {
          query: GET_EQUIPMENTS,
          variables: { offset: 0, limit: 20 },
        },
        result: {
          data: {
            equipments: {
              equipments: mockEquipments.slice(0, 20),
              totalCount: 40,
            },
          },
        },
      },
      {
        request: {
          query: GET_USER_EQUIPMENT,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              equipments: mockUserEquipments, // Empty equipments
            },
          },
        },
      },
      {
        request: {
          query: ADD_EQUIPMENT_TO_CHARACTER,
          variables: { userId: mockUserId, equipmentId: '1' },
        },
        result: {
          data: {
            addEquipmentToCharacter: {
              id: mockUserId,
              equipments: [helmetEquipment],
            },
          },
        },
      },
      {
        request: {
          query: GET_USER_EQUIPMENT,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              equipments: [helmetEquipment],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
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
            <EquipmentPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );

    const equipmentCardHeading = await screen.findByText('Helmet');
    const equipmentCard = equipmentCardHeading.closest('section') as HTMLElement;
    expect(equipmentCard).toBeInTheDocument();

    const checkBox = await within(equipmentCard).findByRole('checkbox');

    await waitFor(() => expect(checkBox).not.toBeChecked());

    await user.click(checkBox);

    await waitFor(() => expect(checkBox).toBeChecked());

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Helmet was added to your equipments',
        type: 'success',
        duration: 3000,
      })
    );
  });

  it('handles removing an equipment from user equipments', async () => {
    const user = userEvent.setup();

    const mockUserEquipments = [helmetEquipment];

    const mocks = [
      {
        request: {
          query: GET_EQUIPMENTS,
          variables: { offset: 0, limit: 20 },
        },
        result: {
          data: {
            equipments: {
              equipments: mockEquipments.slice(0, 20),
              totalCount: 40,
            },
          },
        },
      },

      {
        request: {
          query: GET_USER_EQUIPMENT,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              equipments: mockUserEquipments,
            },
          },
        },
      },

      {
        request: {
          query: REMOVE_EQUIPMENT_FROM_CHARACTER,
          variables: { userId: mockUserId, equipmentId: '1' },
        },
        result: {
          data: {
            removeEquipmentFromCharacter: {
              id: mockUserId,
              equipments: [],
            },
          },
        },
      },

      {
        request: {
          query: GET_USER_EQUIPMENT,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              equipments: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
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
            <EquipmentPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );

    const equipmentCardHeading = await screen.findByText('Helmet');
    const equipmentCard = equipmentCardHeading.closest('section') as HTMLElement;
    expect(equipmentCard).toBeInTheDocument();

    const checkBox = await within(equipmentCard).findByRole('checkbox');

    await waitFor(() => expect(checkBox).toBeChecked());

    await user.click(checkBox);

    await waitFor(() => expect(checkBox).not.toBeChecked());

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Helmet removed from equipments',
        type: 'info',
        duration: 5000,
        undoAction: expect.any(Function),
      })
    );
  });
  it('removes all equipments', async () => {
    const user = userEvent.setup();

    const mockUserEquipments = [helmetEquipment];

    const mocks = [
      {
        request: {
          query: GET_EQUIPMENTS,
          variables: { offset: 0, limit: 20 },
        },
        result: {
          data: {
            equipments: {
              equipments: mockEquipments.slice(0, 20),
              totalCount: 40,
            },
          },
        },
      },
      {
        request: {
          query: GET_USER_EQUIPMENT,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              equipments: mockUserEquipments,
            },
          },
        },
      },
      {
        request: {
          query: REMOVE_ALL_EQUIPMENTS,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            removeAllEquipments: {
              id: mockUserId,
              equipments: [],
            },
          },
        },
      },
      {
        request: {
          query: GET_USER_EQUIPMENT,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              equipments: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
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
            <EquipmentPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );

    const equipmentCardHeading = await screen.findByText('Helmet');
    const equipmentCard = equipmentCardHeading.closest('section') as HTMLElement;
    expect(equipmentCard).toBeInTheDocument();
    const checkBox = await within(equipmentCard).findByRole('checkbox');

    await waitFor(() => expect(checkBox).toBeChecked());

    const removeAllButton = await screen.findByText('Remove All Equipments');
    expect(removeAllButton).toBeInTheDocument();

    await user.click(removeAllButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'All equipments removed',
        type: 'info',
        duration: 5000,
        undoAction: expect.any(Function),
      });
    });
    await waitFor(() => expect(checkBox).not.toBeChecked());

    const allCeckboxes = await screen.findAllByRole('checkbox');
    await waitFor(() => {
      for (const checkbox of allCeckboxes) {
        expect(checkbox).not.toBeChecked();
      }
    });
  });

  it('matches snapshot for paginated equipments', async () => {
    const mocks = [
      // Mock for GET_EQUIPMENTS
      {
        request: {
          query: GET_EQUIPMENTS,
          variables: { offset: 0, limit: 20 },
        },
        result: {
          data: {
            equipments: {
              equipments: mockEquipments.slice(0, 20),
              totalCount: 40,
            },
          },
        },
      },
      // Mock for GET_USER_EQUIPMENT
      {
        request: {
          query: GET_USER_EQUIPMENT,
          variables: { userId: mockUserId },
        },
        result: {
          data: {
            user: {
              id: mockUserId,
              equipments: [helmetEquipment],
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
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
            <EquipmentPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );

    const prevButton = await screen.findByRole('button', { name: 'navigate previous' });
    const nextButton = await screen.findByRole('button', { name: 'navigate next' });
    await waitFor(() => {
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(prevButton).toMatchSnapshot();
      expect(nextButton).toMatchSnapshot();
    });
  });
});
