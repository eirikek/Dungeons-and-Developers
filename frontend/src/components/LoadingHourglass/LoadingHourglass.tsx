import { hourglass } from 'ldrs';
import LoadingHourglassProps from '../../interfaces/LoadingHourglassProps.ts';

/**
 * Renders a loading component displayed as an hourglass.
 *
 * @param {string} height - The height of the container for the loading hourglass. Value is `79.5vh`.
 *
 **/

export default function LoadingHourglass({ height = 'h-[79.5vh]' }: LoadingHourglassProps) {
  hourglass.register();

  return (
    <div className={`flex flex-col items-center justify-center ${height}`} data-testid={'hourglass-container'}>
      <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
    </div>
  );
}
