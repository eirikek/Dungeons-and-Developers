import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  textSize?: string;
  linkTo?: string;
  noUnderline?: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
  onFocus?: () => void; // Added onFocus handler
  onBlur?: () => void; // Added onBlur handler
}

export default function CustomButton({
  text,
  onClick,
  className = 'sub-header',
  linkTo,
  noUnderline = false,
  isActive = false,
  children,
  onFocus, // Capture onFocus prop
  onBlur, // Capture onBlur prop
}: ButtonProps) {
  const underlineClass = noUnderline
    ? ''
    : `absolute bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 ${
        isActive ? 'w-full left-0' : 'left-1/2'
      }`; // Underline styling based on active state

  const activeClass = isActive
    ? 'bold xl:font-[MedievalSharp]' // Bold text for active state
    : '';

  const buttonContent = (
    <>
      {text}
      <span className={underlineClass}></span>
      {children}
    </>
  );

  // If linkTo is provided, use the Link component for navigation
  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className={`w-fit relative group flex ${activeClass} ${className}`}
        onFocus={onFocus} // Pass down onFocus
        onBlur={onBlur} // Pass down onBlur
      >
        {buttonContent}
      </Link>
    );
  }

  // Otherwise, render a regular button
  return (
    <button
      className={`relative group flex ${activeClass} ${className}`}
      onClick={onClick}
      onFocus={onFocus} // Pass down onFocus
      onBlur={onBlur} // Pass down onBlur
    >
      {buttonContent}
    </button>
  );
}
