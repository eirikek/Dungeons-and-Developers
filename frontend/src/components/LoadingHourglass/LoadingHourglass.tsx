import { hourglass } from 'ldrs';

interface LoadingHourglassProps {
  height?: string;
}

export default function LoadingHourglass({ height = 'h-[79.5vh]' }: LoadingHourglassProps) {
  hourglass.register();

  return (
    <div className={`flex flex-col items-center justify-center ${height}`}>
      <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
    </div>
  );
}
