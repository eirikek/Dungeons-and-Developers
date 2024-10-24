import { createContext, ReactNode, useReducer } from 'react';

const initialState = {
  user: localStorage.getItem("token")? JSON.parse(localStorage.getItem("token") !): "",
};

interface LoginState{
  user: string
}


const AuthContext = createContext<{
  user: string;
  login: (data: { token: string }) => void;
}>
({
  user:"",
  login: () => {},
});



function authReducer( state: LoginState, action: any ) {
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
interface AuthProviderProps{
  children: ReactNode;
}

function AuthProvider({children}:AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (useData: { token: string; }) => {
    localStorage.setItem('token', JSON.stringify(useData.token));
    dispatch({ type: 'LOGIN', payload: useData})}



  return(
    <>
      <AuthContext.Provider
      value={{user: state.user, login}}>
        {children}
      </AuthContext.Provider>
    </>
  )
}
export {AuthContext, AuthProvider}