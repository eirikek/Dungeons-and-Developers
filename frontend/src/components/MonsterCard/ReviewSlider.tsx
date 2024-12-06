import { Slider, Box, SxProps } from '@mui/material';
import { GiDaemonSkull, GiGoblinHead, GiRoundShield, GiSpikedDragonHead } from 'react-icons/gi';
import { LuSwords } from 'react-icons/lu';
import React from 'react';
import { Theme } from '@mui/system';

/**
 * ReviewSlider component displays a slider with custom marks and icons for rating difficulty.
 *
 * @param {number} value - The current value of the slider.
 * @param {function} [onChange] - The function to handle slider value changes.
 * @param {boolean} [disabled=false] - Boolean value that checks if it is disabled or not.
 * @param {Array} [marks=marks] - The array of marks to be displayed on the slider with custom icons.
 * @param {number} [min=0] - The minimum value of the slider.
 * @param {number} [max=100] - The maximum value of the slider.
 * @param {number} [step=10] - The step value of the slider.
 * @param {SxProps<Theme>} [sx] - Custom styles for the slider.
 *
 * @interface SliderProps - Issue with splitting up into a separate file for interface and marks.
 * But is the interface passed down to the component.
 */
const marks = [
  { value: 10, label: <LuSwords size={20} /> },
  { value: 30, label: <GiRoundShield size={20} /> },
  { value: 50, label: <GiGoblinHead size={20} /> },
  { value: 70, label: <GiSpikedDragonHead size={20} /> },
  { value: 90, label: <GiDaemonSkull size={20} /> },
];

interface SliderProps {
  value: number;
  onChange?: (event: Event, newValue: number | number[]) => void;
  disabled?: boolean;
  marks?: typeof marks;
  min?: number;
  max?: number;
  step?: number;
  sx?: SxProps<Theme>;
}

const ReviewSlider: React.FC<SliderProps> = ({ value, onChange, disabled = false, sx }) => {
  const getStringValue = (value: number) => {
    return `${value}`;
  };

  return (
    <Box>
      <Slider
        data-testid="review-slider"
        value={value}
        onChange={onChange}
        getAriaValueText={getStringValue}
        aria-valuenow={value}
        marks={marks}
        disabled={disabled}
        min={0}
        max={100}
        step={10}
        valueLabelDisplay="auto"
        sx={{
          '& .MuiSlider-markLabel': {
            color: 'white',
            fontFamily: 'MedievalSharp',
            fontSize: '1.5rem',
          },
          '& .MuiSlider-mark': {
            color: 'white',
            width: 5,
            height: 5,
            borderRadius: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
          },
          '& .MuiSlider-thumb': {
            color: disabled ? 'transparent' : '#DB3232',
            width: 24,
            height: 24,
          },
          '& .MuiSlider-track': {
            color: '#DB3232',
            height: 10,
          },
          '& .MuiSlider-rail': {
            color: '#DB3232',
            height: 10,
          },
          ...sx,
        }}
      />
    </Box>
  );
};

export default ReviewSlider;
