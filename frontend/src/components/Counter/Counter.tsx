import { useEffect, useRef, useState } from 'react';
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
  const [activeDelta, setActiveDelta] = useState<number | null>(null);
  const [lastFinalizedValue, setLastFinalizedValue] = useState<number | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const clearTimer = () => {
    if (changeTimer.current) {
      clearInterval(changeTimer.current);
      changeTimer.current = null;
    }
    if (activeDelta !== null) {
      finalizeValue();
    }
    setActiveDelta(null);
    onPointerUp?.();
    onMouseUp?.();
  };

  const startChange = (delta: number) => {
    if (activeDelta === delta) return;

    clearTimer();
    setActiveDelta(delta);

    changeTimer.current = setInterval(() => {
      setLocalValue((prevValue) => {
        const newValue = (prevValue + delta + 101) % 101;
        onChange?.(newValue);
        return newValue;
      });
    }, 100);
  };

  const finalizeValue = () => {
    if (lastFinalizedValue === localValue) return;

    setLastFinalizedValue(localValue);
    onValueFinalized?.(localValue);
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
        aria-controls="ability-score-value"
      >
        <FaChevronUp size={22} />
      </button>

      <output
        id="ability-score-value"
        className="text text-white w-12 text-center"
        aria-live="polite"
        role="status"
        aria-label="ability-score-value"
      >
        {localValue}
      </output>

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
        aria-controls="ability-score-value"
      >
        <FaChevronDown size={22} />
      </button>
    </div>
  );
}
