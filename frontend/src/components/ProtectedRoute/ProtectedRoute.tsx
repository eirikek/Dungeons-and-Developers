import { Navigate } from 'react-router-dom';
import ProtectedRouteProps from '../../interfaces/ProtectedRouteProps.ts';

/**
 * ProtectedRoute component is used to wrap a path that requires the user to be authenticated.
 * If the user isn't authenticated (i.e., no token is found in localStorage), they are redirected to the homepage.
 * If the user is authenticated (i.e., a token exists), the children components are rendered.
 *
 * @param {React.ReactNode} children - If the user is authenticated the children will be rendered in the component
 *
 * Features:
 * - Looks for a token in `localStorage` to see if the user is authenticated.
 * - Redirects the user to the homepage if the token isn't found.
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" />;
}

export default ProtectedRoute;
