import { Box, IconButton, Button } from '@mui/material';
import { MdDelete, MdEdit, MdSave, MdCancel } from 'react-icons/md';
import { useMutation } from '@apollo/client';
import { ReviewProps, ReviewType } from '../../interfaces/ReviewProps.ts';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState, useRef } from 'react';
import ReviewSlider from './ReviewSlider.tsx';
import ReviewTextField from './ReviewTextField.tsx';
import { useToast } from '../../hooks/useToast';
import { ADD_REVIEW, DELETE_REVIEW, UPDATE_REVIEW } from '../../graphql/mutations/monsterMutations.ts';
import { GET_MONSTER_REVIEWS } from '../../graphql/queries/monsterQueries.ts';
/**
 * Renders review component to edit, submit and review.
 *
 * @param {string} monsterId - The ID of the monster being reviewed.
 * @param {string} monsterName - The name of the monster being reviewed.
 *
 *
 * Functionality:
 * - Display the review details
 * - Editing the review
 * - Deleting the review
 * - Undo button
 */
const Review = ({ review, monsterId, monsterName }: ReviewProps) => {
  const { userId } = useContext(AuthContext);
  const { user, difficulty, description, id: reviewId } = review;
  const [editMode, setEditMode] = useState(false);
  const [updatedDifficulty, setUpdatedDifficulty] = useState(difficulty);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const { showToast } = useToast();
  const deletedReviewRef = useRef<ReviewType | null>(null);

  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: GET_MONSTER_REVIEWS, variables: { monsterId } }],
  });

  const [updateReview] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [{ query: GET_MONSTER_REVIEWS, variables: { monsterId } }],
  });

  const [addReview] = useMutation(ADD_REVIEW, {
    refetchQueries: [{ query: GET_MONSTER_REVIEWS, variables: { monsterId } }],
  });

  const handleDelete = async () => {
    deletedReviewRef.current = review;
    try {
      await deleteReview({
        variables: { monsterId, reviewId },
      });
      showToast({
        message: `Review on ${monsterName} deleted`,
        type: 'info',
        undoAction: undoRemoveReview,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const undoRemoveReview = async () => {
    if (deletedReviewRef.current) {
      const { difficulty, description } = deletedReviewRef.current;
      await addReview({
        variables: {
          monsterId,
          review: { user: userId, difficulty, description },
        },
      });
      showToast({ message: `Review on ${monsterName} restored`, type: 'success', duration: 3000 });
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
      showToast({ message: `Review on ${monsterName} updated`, type: 'success', duration: 3000 });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <Box
      className="relative rounded mb-4 gap-6 flex flex-col w-full"
      sx={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        padding: 2,
        border: '1px solid white',
        borderRadius: '8px',
      }}
    >
      {userId === user.id && (
        <>
          <IconButton
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: 10,
              right: 50,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: '#DB3232',
                color: '#DB3232',
              },
            }}
            aria-label="Delete"
          >
            <MdDelete size={30} />
          </IconButton>
          <IconButton
            onClick={handleEditToggle}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: '#DB3232',
                color: '#DB3232',
              },
            }}
            aria-label="Edit"
          >
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
          <Button
            onClick={handleSave}
            startIcon={<MdSave size={30} />}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: '#DB3232',
                color: '#DB3232',
              },
              fontFamily: 'MedievalSharp',
              fontSize: '1.5rem',
            }}
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <ReviewSlider value={difficulty} disabled />
          <p className="text">Difficulty: {difficulty}</p>
          <p
            className="text"
            style={{
              wordWrap: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {description}
          </p>
        </>
      )}
    </Box>
  );
};

export default Review;
