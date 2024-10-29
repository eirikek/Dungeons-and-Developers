import { Box, IconButton, Button } from '@mui/material';
import { MdDelete, MdEdit, MdSave, MdCancel } from 'react-icons/md';
import { useMutation } from '@apollo/client';
import { DELETE_REVIEW, UPDATE_REVIEW, GET_MONSTER_REVIEWS } from '../../../../backend/src/graphql/queries';
import { ReviewType } from '../../interfaces/ReviewProps.ts';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import ReviewSlider from './ReviewSlider.tsx';
import ReviewTextField from './ReviewTextField.tsx';

type ReviewProps = {
  review: ReviewType;
  monsterId: string;
};

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
    <Box className="relative rounded mb-4 gap-6 flex flex-col w-full"
         sx={{
           width: '100%', // Sets the width to occupy the full container width.
           maxWidth: '500px', // Limits the width to prevent overflow.
           margin: '0 auto', // Centers the Box in its container.
           padding: 2,
           border: '1px solid white',
           borderRadius: '8px',
         }}
    >
      {userId === user.id && (
        <>
          <IconButton onClick={handleDelete} sx={{
            position: 'absolute', top: 10, right: 50, color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: '#DB3232',
              color: '#DB3232',
            },
          }}>
            <MdDelete size={30} />
          </IconButton>
          <IconButton onClick={handleEditToggle} sx={{
            position: 'absolute', top: 10, right: 10, color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: '#DB3232',
              color: '#DB3232',
            },
          }}>
            {editMode ? <MdCancel size={30} /> : <MdEdit size={30} />}
          </IconButton>
        </>
      )}
      <h4 className="sub-header">{user.userName}</h4>

      {editMode ? (
        <>
          <ReviewSlider value={updatedDifficulty} onChange={(_, value) => setUpdatedDifficulty(value as number)} />
          <ReviewTextField
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value.slice(0, 300))}
            label={''}
          />
          <Button onClick={handleSave} startIcon={<MdSave size={30} />}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: '#DB3232',
                      color: '#DB3232',
                    },
                    fontFamily: 'MedievalSharp',
                    fontSize: '1.5rem',
                  }}>
            Save
          </Button>
        </>
      ) : (
        <>
          <ReviewSlider value={difficulty} disabled />
          <p className="text">Difficulty: {difficulty}</p>
          <p className="text" style={{
            wordWrap: 'break-word',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{description}</p>
        </>

      )}
    </Box>
  );
};

export default Review;