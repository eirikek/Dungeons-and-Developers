import { render, screen, waitFor } from '@testing-library/react';
import DungeonMonsterGrid from '../../../src/components/Dungeon/DungeonMonsterGrid.tsx';

import { MockedProvider } from '@apollo/client/testing';

import {
  ADD_FAVORITE_MONSTER,
  GET_USER_FAVORITES,
  REMOVE_FAVORITE_MONSTER,
} from '../../../../backend/src/graphql/queries.ts';
import { DungeonProvider } from '../../../src/context/DungeonContext.tsx';
import MockToastProvider from '../../../src/components/Toast/CustomToast.tsx';
import { useToast } from 'src/hooks/useToast.ts';
import { beforeEach } from 'vitest';
import DungeonStats from '../../../src/components/Dungeon/DungeonStats.tsx';

vi.mock('../../../src/hooks/useToast.ts');
const mockedUseToast = useToast as jest.Mock;

const mockFavoritesData = {
  user: {
    favoritedMonsters: [
      {
        id: '1',
        name: 'Goblin',
        size: 'Small',
        type: 'humanoid',
        alignment: 'neutral evil',
        hit_points: 7,
      },
      {
        id: '2',
        name: 'Skeleton',
        size: 'Medium',
        type: 'undead',
        alignment: 'lawful evil',
        hit_points: 75,
      },
    ],
  },
};

const mocks = [
  {
    request: {
      query: ADD_FAVORITE_MONSTER,
      variables: { userId: 'user1', monsterId: '3' },
    },
    result: {
      data: {
        addFavoriteMonster: {
          favoritedMonster: [{ id: '1' }, { id: '2' }, { id: '3' }],
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_FAVORITES,
      variables: { userId: 'user1' },
    },
    result: {
      data: mockFavoritesData,
    },
  },
  {
    request: {
      query: REMOVE_FAVORITE_MONSTER,
      variables: { userId: 'user1', monsterId: '1' },
    },
    result: {
      data: {
        removeFavoriteMonster: {
          favoritedMonster: [{ id: '2' }],
        },
      },
    },
  },
];

describe('DungeonProvider', () => {
  beforeEach(() => {
    mockedUseToast.mockReturnValue({ showToast: vi.fn() });
  });
  it('renders correctly and matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DungeonProvider userId="1">
          <DungeonStats />
        </DungeonProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Dungeon')).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
