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
    <Box className="border-[1px] border-white p-4 rounded mb-4 gap-6 flex flex-col">
      <h4 className="sub-header">{user}</h4>
      <Slider
        value={difficulty}
        marks={marks}
        disabled
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
            display: 'none',
          },
          '& .MuiSlider-track': {
            color: '#DB3232',
            height: 10,
          },
          '& .MuiSlider-rail': {
            color: '#DB3232',
            height: 10,
          },
        }}
      />
      <p className="text">Difficulty: {difficulty}</p>
      <p className="text">{description}</p>
    </Box>
  );
};

export default Review;