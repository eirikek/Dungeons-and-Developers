import { useRef } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface CounterProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function Counter({ value, onChange }: CounterProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);  // Reference to store the interval ID

  const handleIncrement = () => {
    if (value < 100) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const startIncrement = () => {
    handleIncrement();
    intervalRef.current = setInterval(handleIncrement, 100);
  };

  const startDecrement = () => {
    handleDecrement();
    intervalRef.current = setInterval(handleDecrement, 100);
  };

  const stopAction = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="text-white hover:text-gray-400"
        onMouseDown={startIncrement}
        onMouseUp={stopAction}
        onMouseLeave={stopAction}
        onTouchStart={startIncrement}
        onTouchEnd={stopAction}
      >
        <FaChevronUp size={24} />
      </button>
      <div className="text-2xl text-white py-2">{value}</div>
      <button
        className="text-white hover:text-gray-400"
        onMouseDown={startDecrement}
        onMouseUp={stopAction}
        onMouseLeave={stopAction}
        onTouchStart={startDecrement}
        onTouchEnd={stopAction}
      >
        <FaChevronDown size={24} />
      </button>
    </div>
  );
};