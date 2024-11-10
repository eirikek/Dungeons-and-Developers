import { Box, Slider } from '@mui/material';
import { useState } from 'react';

interface HitPointsFilterProps {
  onHpChange: (min: number, max: number) => void;
}

export default function HitPointsFilter({ onHpChange }: HitPointsFilterProps) {
  const sliderMin = 1;
  const sliderMax = 546;

  const [hpRange, setHpRange] = useState<number[]>([sliderMin, sliderMax]);

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
