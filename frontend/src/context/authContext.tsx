import { createContext, ReactNode, useReducer } from 'react';

// Define the initial state with proper typing
const initialState: LoginState = {
  user: localStorage.getItem('token') || '',
};

// Define the structure of the state
interface LoginState {
  user: string;
}

// Define the structure of the action (in this case, only 'LOGIN')
interface LoginAction {
  type: 'LOGIN';
  payload: {
    token: string;
  };
}

type AuthAction = LoginAction;

const AuthContext = createContext<{
  user: string;
  login: (data: { token: string }) => void;
}>({
  user: '',
  login: () => {

  },
});

function authReducer(state: LoginState, action: AuthAction): LoginState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.token,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData: { token: string }) => {
    localStorage.setItem('token', userData.token);
    dispatch({ type: 'LOGIN', payload: userData });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };