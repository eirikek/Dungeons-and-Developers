import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, vi } from 'vitest';
import AnimatedRoutes from '../../../src/components/AnimatedRoutes/AnimatedRoutes';

vi.mock('../../../src/pages/mainPages/loginPage.tsx', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('../../../src/pages/mainPages/homePage.tsx', () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock('../../../src/pages/mainPages/dungeonPage.tsx', () => ({
  default: () => <div>Dungeon Page</div>,
}));

vi.mock('../../../src/pages/subPages/classPage.tsx', () => ({
  default: () => <div>Class Page</div>,
}));

vi.mock('../../../src/pages/subPages/racePage.tsx', () => ({
  default: () => <div>Race Page</div>,
}));

vi.mock('../../../src/pages/subPages/abilityScorePage.tsx', () => ({
  default: () => <div>Ability Score Page</div>,
}));

vi.mock('../../../src/pages/subPages/equipmentPage.tsx', () => ({
  default: () => <div>Equipment Page</div>,
}));

vi.mock('../../../src/pages/mainPages/monsterPage.tsx', () => ({
  default: () => <div>Monster Page</div>,
}));

vi.mock('../../../src/pages/mainPages/myCharacterPage.tsx', () => ({
  default: () => <div>My Character Page</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/home' }),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock('../../../src/components/ProtectedRoute/ProtectedRoute.tsx', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
describe('AnimatedRoutes', () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });
  it('renders the correct component based on the route', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/home']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders LoginPage when the route is /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    waitFor(() => {
      const loginText = screen.getByText('Log in');
      expect(loginText).toBeTruthy();
    });
  });

  it('renders HomePage when the route is /home', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    const homeText = screen.getByText('Home Page');
    expect(homeText).toBeTruthy();
  });

  it('renders DungeonPage when the route is /dungeon', () => {
    render(
      <MemoryRouter initialEntries={['/dungeon']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    waitFor(() => {
      const myDungeon = screen.getByText('My dungeon');
      expect(myDungeon).toBeTruthy();
    });
  });

  it('renders MyCharacterPage when the route is /mycharacter', () => {
    render(
      <MemoryRouter initialEntries={['/mycharacter']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    waitFor(() => {
      const myDungeon = screen.getByText('My character');
      expect(myDungeon).toBeTruthy();
    });
  });

  it('renders a snapshot of the EquipmentPage route', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/equipment']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders a snapshot of the RacePage route', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/race']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a snapshot of the ClassPage route', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/class']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a snapshot of the AbilityScorePage route', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/abilityscore']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders race subPage when route is /race', () => {
    render(
      <MemoryRouter initialEntries={['/race']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    waitFor(() => {
      expect(screen.getByText('Dragonborn'));
    });
  });

  it('renders class subPage when route is /class', () => {
    render(
      <MemoryRouter initialEntries={['/class']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    waitFor(() => {
      expect(screen.getByText('Barbarian'));
    });
  });

  it('renders class subPage when route is /abilityscore', () => {
    render(
      <MemoryRouter initialEntries={['/abilityscore']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    waitFor(() => {
      expect(screen.getByText('Charisma'));
    });
  });

  it('wraps the routes in ProtectedRoute', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <AnimatedRoutes />
      </MemoryRouter>
    );
    const homeText = screen.getByText('Home Page');
    expect(homeText).toBeTruthy();
  });
});
