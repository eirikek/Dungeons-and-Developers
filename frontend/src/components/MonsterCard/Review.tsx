import { Slider, Box } from '@mui/material';
import { GiDaemonSkull, GiGoblinHead, GiRoundShield, GiSpikedDragonHead } from 'react-icons/gi';
import { LuSwords } from 'react-icons/lu';

type ReviewProps = {
  review: {
    user: string;
    difficulty: number;
    description: string;
  };
};

const marks = [
  { value: 10, label: <LuSwords size={20} /> },
  { value: 30, label: <GiRoundShield size={20} /> },
  { value: 50, label: <GiGoblinHead size={20} /> },
  { value: 70, label: <GiSpikedDragonHead size={20} /> },
  { value: 90, label: <GiDaemonSkull size={20} /> },
];

const Review = ({ review }: ReviewProps) => {
  const { user, difficulty, description } = review;

  return (
    <Box className="bg-gray-800 p-4 rounded mb-4">
      <h4 className="text-white">{user}</h4>
      <Slider
        value={difficulty}
        marks={marks}
        disabled
        sx={{
          '& .MuiSlider-markLabel': {
            color: 'white',
          },
          '& .MuiSlider-thumb': {
            display: 'none',
          },
          '& .MuiSlider-track': {
            color: '#DB3232',
          },
          '& .MuiSlider-rail': {
            color: '#DB3232',
          },
        }}
      />
      <p className="text-white">{description}</p>
    </Box>
  );
};

export default Review;