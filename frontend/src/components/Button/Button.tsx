import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  textSize?: string;
  linkTo?: string;
  noUnderline?: boolean;
  children?: React.ReactNode;
}

export default function Button({
                                 text,
                                 onClick,
                                 className = '',
                                 textSize = 'text-3xl',
                                 linkTo,
                                 noUnderline = false,
                                 children,
                               }: ButtonProps) {
  const underlineClass = noUnderline
    ? ''
    : 'absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0';

  const buttonContent = (
    <>
      {text}
      <span className={underlineClass}></span>
      {children}
    </>
  );

  // If linkTo is provided, use Link component for navigation
  if (linkTo) {
    return (
      <Link to={linkTo} className={`relative group flex ${textSize} ${className}`}>
        {buttonContent}
      </Link>
    );
  }

  // Otherwise, render a regular button
  return (
    <button className={`relative group flex ${textSize} ${className}`} onClick={onClick}>
      {buttonContent}
    </button>
  );
}