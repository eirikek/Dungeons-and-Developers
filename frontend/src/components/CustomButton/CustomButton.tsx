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
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function CustomButton({
  text,
  onClick,
  className = 'sub-header',
  linkTo,
  noUnderline = false,
  isActive = false,
  children,
  onFocus,
  onBlur,
}: ButtonProps) {
  const underlineClass = noUnderline
    ? ''
    : `absolute bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 ${
        isActive ? 'w-full left-0' : 'left-1/2'
      }`;

  const activeClass = isActive ? 'bold xl:font-[MedievalSharp]' : '';

  const buttonContent = (
    <>
      {text}
      <span className={underlineClass}></span>
      {children}
    </>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className={`w-fit relative group flex ${activeClass} ${className}`}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      className={`relative group flex ${activeClass} ${className}`}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {buttonContent}
    </button>
  );
}
