import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import Review from './Review'; // Import the Review component

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
  onClose: () => void;  // Function to close modal
};

const MonsterDetailsModal = ({ name, hp, type, image, reviews, onClose }: MonsterDetailsModalProps) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}  // Close modal when needed
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: '95vw', md: '90vw', lg: '80vw', xl: '70vw' },
          height: { xs: '100vh', sm: '85vh', md: '85vh', lg: '60vh', xl: '70vh' },
          maxWidth: 'none',
          padding: { xs: 0, sm: 4 },
          backgroundColor: 'black',
        },
      }}
    >
      <DialogContent className="flex flex-col xl:flex-row xl:items-center bg-black gap-6">
        <Box className="w-full xl:w-1/2 flex flex-col gap-[50px] xl:items-center">
          {/* Monster Info */}
          <img src={image} alt={name} className="w-full sm:w-3/4 xl:w-1/2 rounded" />
          <h2 className="sub-header text-white">{name}</h2>
          <p className="text-white">Type: {type}</p>
          <p className="text-white">HP: {hp}</p>
        </Box>

        {/* Reviews Section */}
        <Box className="flex flex-col gap-4 w-full xl:w-1/2 bg-gray-900 p-4 rounded">
          <h3 className="sub-header text-white">Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Review key={index} review={review} />
            ))
          ) : (
            <p className="text-white">No reviews yet.</p>
          )}
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