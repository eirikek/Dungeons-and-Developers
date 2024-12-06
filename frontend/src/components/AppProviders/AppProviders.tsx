import { useContext } from 'react';
import { DungeonProvider } from '../../context/DungeonContext.tsx';
import { AuthContext } from '../../context/AuthContext.tsx';
import AppProvidersProps from '../../interfaces/AppProviderProps.ts';

/**
 * AppProviders ensures that child components have access to the necessary contexts.
 *
 * @param {AppProvidersProps} props - passes children to be wrapped in context providers.
 */
const AppProviders = ({ children }: AppProvidersProps) => {
  const { userId } = useContext(AuthContext);

  return <DungeonProvider userId={userId || ''}>{children}</DungeonProvider>;
};

export default AppProviders;
