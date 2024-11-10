import { Box, Slider } from '@mui/material';
import { useEffect, useState } from 'react';

interface HitPointsFilterProps {
  initialMinHp: number;
  initialMaxHp: number;
  onHpChange: (min: number, max: number) => void;
}

export default function HitPointsFilter({ initialMinHp, initialMaxHp, onHpChange }: HitPointsFilterProps) {
  const [hpRange, setHpRange] = useState<number[]>([initialMinHp, initialMaxHp]);
  const sliderMin = 1;
  const sliderMax = 546;

  useEffect(() => {
    setHpRange([initialMinHp, initialMaxHp]);
  }, [initialMinHp, initialMaxHp]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setHpRange([min, max]);
    onHpChange(min, max);
  };

  return (
    <Box>
      <Slider
        value={hpRange}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={sliderMin}
        max={sliderMax}
        sx={{
          '& .MuiSlider-thumb': { color: '#DB3232', width: 24, height: 24 },
          '& .MuiSlider-track': { color: '#DB3232', height: 10 },
          '& .MuiSlider-rail': { color: '#DB3232', height: 10 },
        }}
      />
      <Box display="flex" width="300px" justifyContent="space-between" mt={1}>
        <span>{hpRange[0]}</span>
        <span>{hpRange[1]}</span>
      </Box>
    </Box>
  );
}
