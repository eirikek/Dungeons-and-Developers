import { TextField } from '@mui/material';
import React from 'react';
import ReviewTextFieldProps from '../../interfaces/ReviewTextFieldProps.ts';

/**
 * ReviewTextField component renders a customizable text field for writing your reviews.
 *
 * @component
 * @param {string} value - The current value of the text field.
 * @param {function} onChange - Handles change of value to the text field.
 * @param {string} [label='Description'] - The label text for the text field.
 *
 */

const ReviewTextField: React.FC<ReviewTextFieldProps> = ({ value, onChange, label = 'Description' }) => {
  return (
    <TextField
      name={label}
      id={label}
      value={value}
      onChange={onChange}
      label={label}
      fullWidth
      multiline
      minRows={4}
      maxRows={12}
      variant="standard"
      sx={{
        '& .MuiInputBase-input': {
          color: 'black',
          fontSize: '1.1rem',
          height: 'auto',
          padding: '20px',
          fontFamily: 'MedievalSharp',
          backgroundColor: 'white',
          borderRadius: '4px',
          marginTop: '15px',
        },
        '& .MuiInputLabel-root': {
          color: 'white',
          fontFamily: 'MedievalSharp',
          fontSize: '1.5rem',
          transform: 'translate(0, -20px)',
          transition: 'transform 0.3s ease, font-size 0.3s ease',
          marginTop: '15px',
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
    />
  );
};

export default ReviewTextField;
