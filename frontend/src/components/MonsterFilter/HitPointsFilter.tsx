import React, { useEffect, useState, useCallback } from 'react';
import { Slider, Box } from '@mui/material';

interface HitPointsFilterProps {
  minHp: number;
  maxHp: number;
  onHpRangeChange: (range: [number, number]) => void;
}

const HitPointsFilter: React.FC<HitPointsFilterProps> = ({ minHp, maxHp, onHpRangeChange }) => {
  const [hpRange, setHpRange] = useState<[number, number]>([minHp, maxHp]);

  useEffect(() => {
    setHpRange([minHp, maxHp]);
  }, [minHp, maxHp]);

  const handleHpChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (Array.isArray(newValue)) {
        setHpRange(newValue as [number, number]);
        onHpRangeChange(newValue as [number, number]);
      }
    },
    [onHpRangeChange]
  );

  return (
    <Box>
      <Slider
        value={hpRange}
        onChange={handleHpChange}
        min={minHp}
        max={maxHp}
        step={1}
        valueLabelDisplay="auto"
        sx={{
          '& .MuiSlider-thumb': { color: '#DB3232', width: 24, height: 24 },
          '& .MuiSlider-track': { color: '#DB3232', height: 10 },
          '& .MuiSlider-rail': { color: '#DB3232', height: 10 },
        }}
      />
      <Box display="flex" width="300px" justifyContent="space-between" mt={1}>
        <span>{minHp}</span>
        <span>{maxHp}</span>
      </Box>
    </Box>
  );
};

export default HitPointsFilter;
