import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slider,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { GiDaemonSkull, GiGoblinHead, GiRoundShield, GiSpikedDragonHead } from 'react-icons/gi';
import { LuSwords } from 'react-icons/lu';

type ReviewType = {
  monsterIndex: string;
  name: string;
  image: string;
};

const marks = [
  {
    value: 10,
    label: <LuSwords size={30} />,
  },
  {
    value: 30,
    label: <GiRoundShield size={30} />,
  },
  {
    value: 50,
    label: <GiGoblinHead size={30} />,
  },
  {
    value: 70,
    label: <GiSpikedDragonHead size={30} />,
  },
  {
    value: 90,
    label: <GiDaemonSkull size={30} />,
  },
];

const MonsterReviewModal = ({ name, monsterIndex, image }: ReviewType) => {
  const [isOpen, setIsOpen] = useState(false);

  const [difficulty, setDifficulty] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleClickOpen = () => {
    const savedReview = localStorage.getItem(`Review: ${monsterIndex}`);
    if (savedReview) {
      const parsedReview = JSON.parse(savedReview);
      setDifficulty(parsedReview.difficulty);
      setDescription(parsedReview.description);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getStringValue = (value: number) => {
    return `${value}`;
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}
              sx={{
                color: 'white',
                borderColor: '#DB3232',
                backgroundColor: '#DB3232',
                padding: '0.2vw 0.5vw',
                minWidth: 'unset',
                minHeight: 'unset',
                height: 'auto',
                lineHeight: 'normal',
                borderRadius: '4px',
                boxSizing: 'border-box',
                '&:hover': {
                  borderColor: '#DB3232',
                  backgroundColor: 'black',
                  color: '#DB3232',
                },
                fontFamily: 'MedievalSharp',
                fontSize: {
                  xs: '3.5vw',
                  sm: '2vw',
                  md: '1.3vw',
                  lg: '1.2vw',
                  xl: '1vw',
                },
                textTransform: 'none',
              }}
      >
        Review
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            localStorage.setItem(
              name,
              JSON.stringify({
                difficulty: difficulty,
                description: description,
              }),
            );
            handleClose();
          },
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
            <img src={image} alt="Image of selected monster" className="w-full sm:w-3/4 xl:w-1/2 rounded" />
            <h2 className="sub-header text-white">Review of {name}</h2>
          </Box>
          <article className="flex flex-col gap-4 w-full xl:w-1/2">
            <DialogContentText sx={{ color: 'white', fontSize: '1.5rem', fontFamily: 'MedievalSharp' }}>
              Difficulty
            </DialogContentText>
            <Box>
              <Slider
                aria-label="Monster difficulty"
                defaultValue={50}
                getAriaValueText={getStringValue}
                valueLabelDisplay="auto"
                shiftStep={30}
                step={10}
                marks={marks}
                min={0}
                max={100}
                value={difficulty}
                onChange={(_, value) => setDifficulty(value as number)}
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
                    color: '#DB3232',
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
                }}
              />
            </Box>
            <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              name="monster-description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              multiline
              minRows={4}
              maxRows={12}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                marginTop: 4,
                '& .MuiInputBase-input': {
                  color: 'black',
                  fontSize: '1.25rem',
                  height: 'auto',
                  padding: '20px',
                  fontFamily: 'MedievalSharp',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  fontFamily: 'MedievalSharp',
                  fontSize: '1.5rem',
                  transform: 'translate(0, -20px)',
                  transition: 'transform 0.3s ease, font-size 0.3s ease',
                },

                '& .MuiInputLabel-root.Mui-focused': {
                  fontSize: '1.25rem',
                  color: 'white',
                },

                '& .MuiInput-underline:before': {
                  borderBottomColor: 'white',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#DB3232',
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottomColor: '#DB3232',
                },

              }}
            ></TextField>
          </article>
        </DialogContent>

        <DialogActions className="bg-black">
          <Button onClick={handleClose} aria-label="Cancel-button" sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: '#DB3232',
              color: '#DB3232',
            },
            fontFamily: 'MedievalSharp',
            fontSize: '1.5rem',
          }}>
            Cancel
          </Button>
          <Button type="submit" aria-label="Save-button" sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: '#DB3232',
              color: '#DB3232',
            },
            fontFamily: 'MedievalSharp',
            fontSize: '1.5rem',
          }}>
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MonsterReviewModal;
