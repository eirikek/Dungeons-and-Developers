import { Slider, Box, IconButton, TextField, Button } from '@mui/material';
import { GiDaemonSkull, GiGoblinHead, GiRoundShield, GiSpikedDragonHead } from 'react-icons/gi';
import { LuSwords } from 'react-icons/lu';
import { MdDelete, MdEdit, MdSave, MdCancel } from 'react-icons/md';
import { useMutation } from '@apollo/client';
import { DELETE_REVIEW, UPDATE_REVIEW, GET_MONSTER_REVIEWS } from '../../../../backend/src/graphql/queries';
import { ReviewType } from '../../interfaces/ReviewProps.ts';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';

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

  const [editMode, setEditMode] = useState(false);
  const [updatedDifficulty, setUpdatedDifficulty] = useState(difficulty);
  const [updatedDescription, setUpdatedDescription] = useState(description);

  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: GET_MONSTER_REVIEWS, variables: { monsterId } }],
  });

  const [updateReview] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [{ query: GET_MONSTER_REVIEWS, variables: { monsterId } }],
  });

  const handleDelete = async () => {
    try {
      await deleteReview({
        variables: { monsterId, reviewId },
      });
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      await updateReview({
        variables: {
          monsterId,
          reviewId,
          review: {
            user: userId,
            difficulty: updatedDifficulty,
            description: updatedDescription,
          },
        },
      });
      console.log('Review updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <Box className="relative border-[1px] border-white p-4 rounded mb-4 gap-6 flex flex-col">
      {userId === user.id && (
        <>
          <IconButton onClick={handleDelete} sx={{ position: 'absolute', top: 10, right: 50, color: '#DB3232' }}>
            <MdDelete size={30} />
          </IconButton>
          <IconButton onClick={handleEditToggle} sx={{ position: 'absolute', top: 10, right: 10, color: '#DB3232' }}>
            {editMode ? <MdCancel size={30} /> : <MdEdit size={30} />}
          </IconButton>
        </>
      )}
      <h4 className="sub-header">{user.userName}</h4>

      {editMode ? (
        <>
          <Slider
            value={updatedDifficulty}
            onChange={(e, newValue) => setUpdatedDifficulty(newValue as number)}
            marks={marks}
            sx={{
              '& .MuiSlider-markLabel': { color: 'white', fontFamily: 'MedievalSharp', fontSize: '1.5rem' },
              '& .MuiSlider-mark': {
                color: 'white',
                width: 5,
                height: 5,
                borderRadius: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              },
              '& .MuiSlider-thumb': { color: '#DB3232', width: 24, height: 24 },
              '& .MuiSlider-track': { color: '#DB3232', height: 10 },
              '& .MuiSlider-rail': { color: '#DB3232', height: 10 },
            }}
          />
          <TextField
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ mt: 2, backgroundColor: 'white', color: 'black', fontFamily: 'MedievalSharp' }}
          />
          <Button onClick={handleSave} startIcon={<MdSave />} sx={{ mt: 2, color: '#DB3232' }}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Slider
            value={difficulty}
            marks={marks}
            disabled
            sx={{
              '& .MuiSlider-markLabel': { color: 'white', fontFamily: 'MedievalSharp', fontSize: '1.5rem' },
              '& .MuiSlider-mark': {
                color: 'white',
                width: 5,
                height: 5,
                borderRadius: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              },
              '& .MuiSlider-thumb': { display: 'none' },
              '& .MuiSlider-track': { color: '#DB3232', height: 10 },
              '& .MuiSlider-rail': { color: '#DB3232', height: 10 },
            }}
          />
          <p className="text">Difficulty: {difficulty}</p>
          <p className="text">{description}</p>
        </>
      )}
    </Box>
  );
};

export default Review;