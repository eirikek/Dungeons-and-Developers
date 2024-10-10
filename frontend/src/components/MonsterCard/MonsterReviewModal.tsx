import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Slider, TextField } from '@mui/material';
import { LuSwords } from 'react-icons/lu';
import { GiRoundShield } from 'react-icons/gi';
import { GiGoblinHead } from 'react-icons/gi';
import { GiSpikedDragonHead } from 'react-icons/gi';
import { GiDaemonSkull } from 'react-icons/gi';
import React, { useState } from 'react';
import useMonsters from '../../hooks/useMonsters.ts';
import NoMonsterImageFound from '../../assets/images/no_monster_image_found.jpg';

type MonsterReviewModal = {
  name: string;
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

const MonsterCardInfo = ({ name }: MonsterReviewModal) => {
  const [isOpen, setIsOpen] = useState(false);

  const [difficulty, setDifficulty] = useState<number>(0);
  const [description, setDescription] = useState('');
  const image = useMonsters(name).img;
  const monsterImageURL = image ? `https://www.dnd5eapi.co${image}` : NoMonsterImageFound;
  const monsterInfo = useMonsters(name);

  const getStringValue = (value: number) => {
    return `${value}`;
  };

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: '#DB3232',
                  color: '#DB3232',
                },
                fontFamily: 'MedievalSharp',
                fontSize: '12px',
              }}>
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
            width: '90vw',
            height: '80vh',
            maxWidth: 'none',
            padding: 4,
            backgroundColor: 'black',
          },
        }}
      >
        <DialogContent className="flex flex-row items-center bg-black gap-6">
          <Box sx={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '50px',
          }}>
            <img src={monsterImageURL} alt="Image of selected monster" className="w-1/2 rounded" />
            <h2 className="text-white text-3xl">{monsterInfo.name}</h2>
          </Box>
          <article className="flex flex-col gap-4 w-1/2">
            <DialogContentText sx={{ color: 'white', fontSize: '24px', fontFamily: 'MedievalSharp' }}>
              Difficulty
            </DialogContentText>
            <Box sx={{ width: 300 }}>
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
                onChange={(_, value) => setDifficulty(value as number)} // Use the second argument directly for value
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
              label="Description of monster review"
              type="text"
              fullWidth
              variant="standard"
              multiline
              minRows={4}
              maxRows={12}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontSize: '20px',
                  height: 'auto',
                  padding: '16px',
                  fontFamily: 'MedievalSharp',
                },

                '& .MuiInputLabel-root': {
                  color: 'white',
                  fontFamily: 'MedievalSharp',
                  fontSize: '24px',
                },

                '& .MuiInputLabel-root.Mui-focused': {
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

export default MonsterCardInfo;
