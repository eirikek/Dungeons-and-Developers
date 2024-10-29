import { createContext, ReactNode, useReducer } from 'react';

const initialState: LoginState = {
  token: localStorage.getItem('token') || '',
  userId: localStorage.getItem('userId') || '',
};

interface LoginState {
  token: string;
  userId: string;
}

interface LoginAction {
  type: 'LOGIN';
  payload: {
    token: string;
    userId: string;
  };
}

type AuthAction = LoginAction;

const AuthContext = createContext<{
  token: string;
  userId: string;
  login: (data: { token: string; userId: string }) => void;
}>({
  token: '',
  userId: '',
  login: () => {
  },
});

function authReducer(state: LoginState, action: AuthAction): LoginState {
  switch (action.type) {
    case 'LOGIN':
      return {
        token: action.payload.token,
        userId: action.payload.userId,
      };
    default:
      return state;
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData: { token: string; userId: string }) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.userId);
    dispatch({ type: 'LOGIN', payload: userData });
  };

  return (
    <AuthContext.Provider value={{ token: state.token, userId: state.userId, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };