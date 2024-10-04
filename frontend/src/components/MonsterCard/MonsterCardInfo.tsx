import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Slider, TextField } from '@mui/material';
import { LuSwords } from 'react-icons/lu';
import { GiRoundShield } from 'react-icons/gi';
import { GiGoblinHead } from 'react-icons/gi';
import { GiSpikedDragonHead } from 'react-icons/gi';
import { GiDaemonSkull } from 'react-icons/gi';
import React, { useState } from 'react';
import useMonster from '../../hooks/useMonster.ts';
import NoMonsterImageFound from '../../assets/NoMonsterImageFound.jpg';

type MonsterCardInfo = {
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

const MonsterCardInfo = ({ name }: MonsterCardInfo) => {
  const [isOpen, setIsOpen] = useState(false);

  const [difficulty, setDifficulty] = useState<number>(0);
  const [description, setDescription] = useState('');
  const image = useMonster(name).img;
  const monsterImageURL = image ? `https://www.dnd5eapi.co${image}` : NoMonsterImageFound;

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
      <Button variant="outlined" onClick={handleClickOpen}>
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
              })
            );
            handleClose();
          },
          sx: {
            width: '700px',
            height: '600px',
            maxWidth: 'none',
            padding: 4,
            backgroundColor: 'black',
          },
        }}
      >
        <DialogContent className="flex flex-row items-center bg-black gap-6">
          <Box sx={{ width: '50%' }}>
            <img src={monsterImageURL} alt="Image of selected monster" />
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
              rows={4}
              maxRows={12}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  fontFamily: 'MedievalSharp',
                  fontSize: '20px',
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'white',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'yellow',
                },
                width: '400px',
              }}
            ></TextField>
          </article>
        </DialogContent>

        <DialogActions className="bg-black">
          <Button onClick={handleClose} aria-label="Cancel-button">
            Cancel
          </Button>
          <Button type="submit" aria-lable="Save-button">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MonsterCardInfo;
