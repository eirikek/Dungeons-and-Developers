import React from 'react';

export default interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  textSize?: string;
  linkTo?: string;
  noUnderline?: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}
