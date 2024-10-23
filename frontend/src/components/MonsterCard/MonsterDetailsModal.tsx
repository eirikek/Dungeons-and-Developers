import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import Review from './Review';

type ReviewType = {
  user: string;
  difficulty: number;
  description: string;
};

type MonsterDetailsModalProps = {
  name: string;
  hp: number;
  type: string;
  image: string;
  reviews: ReviewType[];
  onClose: () => void;
};

const MonsterDetailsModal = ({ name, hp, type, image, reviews, onClose }: MonsterDetailsModalProps) => {
  // Calculate the average difficulty from reviews
  const calculateAverageDifficulty = () => {
    if (reviews.length === 0) return 'No reviews';
    const totalDifficulty = reviews.reduce((sum, review) => sum + review.difficulty, 0);
    return (totalDifficulty / reviews.length).toFixed(1);
  };

  const averageDifficulty = calculateAverageDifficulty();

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: '95vw', md: '90vw', lg: '80vw', xl: '70vw' },
          height: { xs: '100vh', sm: '85vh', md: '85vh', lg: '85vh', xl: '85vh' },
          maxWidth: 'none',
          backgroundColor: 'black',
        },
      }}
    >
      {/* Modal Content */}
      <DialogContent className="flex flex-col xl:flex-row bg-black gap-6 h-full">

        {/* Monster Info Section */}
        <Box className="w-full xl:w-1/2 flex flex-col xl:items-center justify-center gap-2 flex-shrink-0">
          <img src={image} alt={name} className="w-full sm:w-3/4 xl:w-1/2 rounded" />
          <h2 className="header">{name}</h2>

          <div className="flex flex-col gap-2">
            <p className="text">Type: {type}</p>
            <p className="text">HP: {hp}</p>
            <p className="text">Average Difficulty: {averageDifficulty}</p>
          </div>
        </Box>

        {/* Scrollable Reviews Section */}
        <Box className="w-full xl:w-1/2 rounded h-full flex flex-col gap-3">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-black py-4">
            <h2 className="header">Reviews</h2>
          </div>

          {/* Scrollable content for reviews */}
          <div className="overflow-y-auto flex-1 flex flex-col gap-5">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <>
                  <Review key={index} review={review} />
                </>
              ))
            ) : (
              <p className="text">No reviews yet.</p>
            )}
          </div>
        </Box>
      </DialogContent>

      <DialogActions className="bg-black">
        <Button
          onClick={onClose}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonsterDetailsModal;