import { useRef, useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface CounterProps {
  value: number;
  onChange: (newValue: number) => void;
  scale?: number;
  onPointerUp?: () => void;
  onMouseUp?: () => void;
  onValueFinalized?: (finalValue: number) => void;
}

export default function Counter({ value, onChange, scale, onPointerUp, onMouseUp, onValueFinalized }: CounterProps) {
  const changeTimer = useRef<NodeJS.Timeout | null>(null);
  const rate = 100;
  const [localValue, setLocalValue] = useState(value);

  const clearTimer = () => {
    if (changeTimer.current) {
      clearInterval(changeTimer.current);
      changeTimer.current = null;
      onPointerUp?.();
      onMouseUp?.();

      onValueFinalized?.(localValue);
    }
  };

  const startIncrement = () => {
    clearTimer();
    const startTime = Date.now();

    changeTimer.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const incrementValue = Math.floor(elapsedTime / rate);
      let newValue = localValue + incrementValue;

      if (newValue > 100) {
        newValue = newValue % 101;
      }

      setLocalValue(newValue); // Update local state
      onChange(newValue); // Propagate changes locally
    }, 100);
  };

  const startDecrement = () => {
    clearTimer();
    const startTime = Date.now();

    changeTimer.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const decrementValue = Math.floor(elapsedTime / rate);
      let newValue = localValue - decrementValue;

      if (newValue < 0) {
        newValue = 100 - (Math.abs(newValue) % 101);
      }

      setLocalValue(newValue); // Update local state
      onChange(newValue); // Propagate changes locally
    }, 100);
  };

  return (
    <div className="flex flex-col items-center" style={{ transform: `scale(${scale})` }}>
      <button
        className="text-white hover:text-gray-400"
        onMouseDown={startIncrement}
        onMouseUp={clearTimer}
        onMouseLeave={clearTimer}
        onTouchStart={startIncrement}
        onTouchEnd={clearTimer}
        aria-label="Increment"
      >
        <FaChevronUp size={22} />
      </button>

      <div
        className="text-5xl md:text-4xl lg:text-3xl xl:text-2xl 2xl:text-lg text-white w-12 text-center"
        aria-label="ability score value"
      >
        {localValue}
      </div>

      <button
        className="text-white hover:text-gray-400"
        onMouseDown={startDecrement}
        onMouseUp={clearTimer}
        onMouseLeave={clearTimer}
        onTouchStart={startDecrement}
        onTouchEnd={clearTimer}
        aria-label="Decrement"
      >
        <FaChevronDown size={22} />
      </button>
    </div>
  );
}
