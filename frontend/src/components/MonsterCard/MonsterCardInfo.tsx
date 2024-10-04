import { Dialog } from '@mui/material';
import { useState } from 'react';



type MonsterCardInfo = {
  difficulty: number
  depscription: string,

}

const MonsterCardInfo = () => {

  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  }
  
  const handleClose = () => {
    setIsOpen(false);
  }


  return (
    <Dialog open={isOpen} onClose={handleClose} PaperProps={{
      component: "form",
      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const monsterFormData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((monsterFormData as MonsterCardInfo).entries());
        
      }
    }}
  )
};

export default MonsterCardInfo;
