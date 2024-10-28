import { Slider, Box, IconButton } from '@mui/material';
import { GiDaemonSkull, GiGoblinHead, GiRoundShield, GiSpikedDragonHead } from 'react-icons/gi';
import { LuSwords } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md'; // Trashcan icon
import { useMutation } from '@apollo/client';
import { DELETE_REVIEW, GET_MONSTER_REVIEWS } from '../../../../backend/src/graphql/queries';
import { ReviewType } from '../../interfaces/ReviewProps.ts';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

type ReviewProps = {
  review: ReviewType;
  monsterId: string;
};

const marks = [
  { value: 10, label: <LuSwords size={20} /> },
  { value: 30, label: <GiRoundShield size={20} /> },
  { value: 50, label: <GiGoblinHead size={20} /> },
  { value: 70, label: <GiSpikedDragonHead size={20} /> },
  { value: 90, label: <GiDaemonSkull size={20} /> },
];

const Review = ({ review, monsterId }: ReviewProps) => {
  const { userId } = useContext(AuthContext);
  const { user, difficulty, description, id: reviewId } = review;

  console.log('Review Component Rendered:', { reviewId, monsterId, userId });

  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: GET_MONSTER_REVIEWS, variables: { monsterId } }],
  });

  const handleDelete = async () => {
    console.log('Attempting to delete review with:', { monsterId, reviewId });
    try {
      await deleteReview({
        variables: {
          monsterId,
          reviewId,
        },
      });
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };


  return (
    <Box className="relative border-[1px] border-white p-4 rounded mb-4 gap-6 flex flex-col">
      {userId === user.id && (
        <IconButton
          onClick={handleDelete}
          sx={{ position: 'absolute', top: 10, right: 10, color: '#DB3232' }}
          aria-label="Delete review"

        >
          <MdDelete size={30} />
        </IconButton>
      )}
      <h4 className="sub-header">{user.userName}</h4>
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