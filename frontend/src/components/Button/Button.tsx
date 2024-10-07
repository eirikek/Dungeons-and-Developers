import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  textSize?: string;
  linkTo?: string;
}

export default function Button({ text, onClick, className = '', textSize = 'text-3xl', linkTo }: ButtonProps) {
  const buttonContent = (
    <>
      {text}
      <span
        className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
    </>
  );

  // If linkTo is provided, use Link component for navigation
  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className={`relative group ${textSize} ${className}`}
      >
        {buttonContent}
      </Link>
    );
  }

  // Otherwise, render a regular button
  return (
    <button
      className={`relative group ${textSize} ${className}`}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
};