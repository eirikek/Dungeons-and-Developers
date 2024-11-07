import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext, AuthProvider } from '../../src/context/AuthContext.tsx';
import { MockedProvider } from '@apollo/client/testing';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should login and store user data correctly', async () => {
    render(
      <MockedProvider>
        <AuthProvider>
          <AuthContext.Consumer>
            {({ login, token, userId, userName }) => (
              <div>
                <button onClick={() => login({ token: 'abc123', userId: '123', userName: 'John Doe' })}>Login</button>
                <p data-testid="token">{token}</p>
                <p data-testid="userId">{userId}</p>
                <p data-testid="userName">{userName}</p>
              </div>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>
    );
    const user = userEvent.setup();

    const button = screen.getByText('Login');
    await user.click(button);

    expect(screen.getByTestId('token').textContent).toBe('abc123');
    expect(screen.getByTestId('userId').textContent).toBe('123');
    expect(screen.getByTestId('userName').textContent).toBe('John Doe');

    expect(localStorage.getItem('token')).toBe('abc123');
    expect(localStorage.getItem('userId')).toBe('123');
    expect(localStorage.getItem('userName')).toBe('John Doe');
  });

  it('should logout and clear user data', () => {
    render(
      <MockedProvider>
        <AuthProvider>
          <AuthContext.Consumer>
            {({ logout, token, userId, userName }) => (
              <div>
                <button onClick={logout}>Logout</button>
                <p data-testid="token">{token}</p>
                <p data-testid="userId">{userId}</p>
                <p data-testid="userName">{userName}</p>
              </div>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>
    );

    const button = screen.getByText('Logout');
    userEvent.click(button);

    expect(screen.getByTestId('token').textContent).toBe('');
    expect(screen.getByTestId('userId').textContent).toBe('');
    expect(screen.getByTestId('userName').textContent).toBe('');

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(localStorage.getItem('userName')).toBeNull();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MockedProvider>
        <AuthProvider>
          <AuthContext.Consumer>
            {({ login, logout }) => (
              <div>
                <button onClick={() => login({ token: 'abc123', userId: '123', userName: 'John Doe' })}>Login</button>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
