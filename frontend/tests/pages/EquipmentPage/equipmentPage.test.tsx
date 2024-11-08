import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import EquipmentPage from '../../../src/pages/subPages/equipmentPage.tsx';
import { GET_USER_EQUIPMENT, REMOVE_ALL_EQUIPMENTS } from '../../../../backend/src/graphql/queries.ts';
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

const mockEquipments = [
  { id: '1', index: '1', name: 'Helmet', category: 'Headgear', value: 4 },
  { id: '2', index: '2', name: 'Sword', category: 'Weapon', value: 5 },
];
const mockUserEquipments = [{ id: '1', index: '1', name: 'Helmet', category: 'Headgear', value: 4 }];
const mockUserId = '1';
const mockToken = 'mock-token'; // Mock token
const mockUserName = 'Mock User'; // Mock user name

const mocks = [
  {
    request: {
      query: GET_EQUIPMENTS,
      variables: { offset: 0, limit: 20 },
    },
    result: {
      data: {
        equipments: {
          equipments: mockEquipments,
          totalCount: 2,
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
      variables: { userId: '1' },
    },
    result: {
      data: {
        removeAllEquipments: true,
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

describe('EquipmentPage', () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider
          value={{ userId: mockUserId, token: mockToken, userName: mockUserName, login: vi.fn(), logout: vi.fn() }}
        >
          <BrowserRouter>
            <EquipmentPage />
          </BrowserRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });

  it('renders correctly and matches snapshot', async () => {
    await waitFor(() => {
      expect(screen.getByText('Equipments')).toBeInTheDocument();
    });
    expect(screen.queryByText('No equipments available')).toBeNull();

    expect(screen.getByRole('main')).toMatchSnapshot();
  });

  it('handles adding an equipment to user equipments', async () => {
    const user = userEvent.setup();
    const equipmentCard = await screen.findByText('Helmet');

    const checkBox = await within(equipmentCard).findByRole('checkbox');

    await user.click(checkBox);

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
    const equipmentCard = screen.getByTestId('Helmet-equipment-card');
    const removeButton = within(equipmentCard).getByText('Remove from equipments');
    await user.click(removeButton);

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Helmet removed from equipments',
        type: 'info',
        duration: 5000,
      })
    );
  });

  it('removes all equipments', async () => {
    const user = userEvent.setup();
    const removeAllButton = screen.getByText('Remove All Equipments');
    await user.click(removeAllButton);

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'All equipments removed',
        type: 'info',
        duration: 5000,
      })
    );
  });

  it('matches snapshot for paginated equipments', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
    expect(screen.getByRole('navigation')).toMatchSnapshot();
  });
});
