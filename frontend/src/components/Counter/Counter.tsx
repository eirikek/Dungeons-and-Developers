import { useRef, useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface CounterProps {
  value: number;
  onChange?: (newValue: number) => void;
  scale?: number;
  onPointerUp?: () => void;
  onMouseUp?: () => void;
  onValueFinalized?: (finalValue: number) => void;
}

export default function Counter({ value, onChange, scale, onPointerUp, onMouseUp, onValueFinalized }: CounterProps) {
  const changeTimer = useRef<NodeJS.Timeout | null>(null);
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const clearTimer = () => {
    if (changeTimer.current) {
      clearInterval(changeTimer.current);
      changeTimer.current = null;
      onPointerUp?.();
      onMouseUp?.();
      onValueFinalized?.(localValue);
    }
  };

  const startChange = (delta: number) => {
    clearTimer();
    changeTimer.current = setInterval(() => {
      setLocalValue((prevValue) => {
        const newValue = (prevValue + delta + 101) % 101;
        if (onChange) {
          onChange(newValue);
        }
        return newValue;
      });
    }, 100);
  };

  const handleIncrement = () => startChange(1);
  const handleDecrement = () => startChange(-1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, delta: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      startChange(delta);
    }
  };

  const handleKeyUp = () => {
    clearTimer();
  };

  return (
    <div className="flex flex-col items-center" style={{ transform: `scale(${scale})` }}>
      <button
        className="text-white hover:text-gray-400"
        onMouseDown={handleIncrement}
        onMouseUp={clearTimer}
        onMouseLeave={clearTimer}
        onTouchStart={handleIncrement}
        onTouchEnd={clearTimer}
        onKeyDown={(e) => handleKeyDown(e, 1)}
        onKeyUp={handleKeyUp}
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
        onMouseDown={handleDecrement}
        onMouseUp={clearTimer}
        onMouseLeave={clearTimer}
        onTouchStart={handleDecrement}
        onTouchEnd={clearTimer}
        onKeyDown={(e) => handleKeyDown(e, -1)}
        onKeyUp={handleKeyUp}
        aria-label="Decrement"
      >
        <FaChevronDown size={22} />
      </button>
    </div>
  );
}
