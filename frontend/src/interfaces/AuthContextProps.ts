export interface LoginState {
  token: string;
  userId: string;
  userName: string;
}

export interface LoginAction {
  type: 'LOGIN';
  payload: {
    token: string;
    userId: string;
    userName: string;
  };
}

export interface LogoutAction {
  type: 'LOGOUT';
}
