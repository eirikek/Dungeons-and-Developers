import { BrowserRouter } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes/AnimatedRoutes.tsx';

/**
 * Root application component.
 *
 * Sets up routing for the application using `react-router-dom`.
 * - `BrowserRouter` is configured with a `basename` for proper route resolution in deployments.
 * - The `AnimatedRoutes` component handles route transitions and animations.
 */

function App() {
  return (
    <BrowserRouter basename="/project2">
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
