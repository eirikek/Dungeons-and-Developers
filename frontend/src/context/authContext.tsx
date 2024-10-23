import { createContext, useReducer } from 'react';



const initialState = {
  user: ""
};

interface LoginState{
  user: string
}

if (localStorage.getItem('token')) {
  initialState.user = JSON.parse(localStorage.getItem('token')!);
}

const AuthContext = createContext({
  user: "",
  login: (useData) => {
  },
});

function authReducer( state: LoginState, action: any ) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

function AuthProvider() {
  const [state, dispatch] = useReducer(authReducer, { user: "" })

  const login = (useData: { token: string; }) => {
    localStorage.setItem('token', useData.token);

    dispatch({ type: 'LOGIN', payload: useData})}



  return(
    <>
      <AuthContext.Provider
      value={{user: state.user, login}}
      />
    </>
  )
}
export {AuthContext, AuthProvider}