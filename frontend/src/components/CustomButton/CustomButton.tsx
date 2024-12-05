import { Link } from 'react-router-dom';
import ButtonProps from '../../interfaces/ButtonProps.ts';
/**
 * Renders a button component that can either be HTML button or a link.
 *
 * @param {string} text - The text of the button.
 * @param {() => void} onClick - Function to handle click events.
 * @param {string} className - Used for styling, in this case it is passed 'sub-header'.
 * @param {string} linkTo - If it is a link, it renders the button as the link to the destination.
 * @param {boolean} noUnderline - Boolean value that decides if it is underlined or not.
 * @param {boolean} isActive - Boolean value that decides if the button is in an active state.
 * @param {React.ReactNode} children - Child elements that is displayed in the button.
 * @param {() => void} onFocus - Function that handles the case when button is in focus.
 * @param {() => void} onBlur - Function that handles the case when button loses focus.
 *
 * **/
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

  const baseClasses = 'sub-header';

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className={`w-fit relative group flex ${baseClasses} ${activeClass} ${className}`}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      className={`relative group flex ${baseClasses} ${activeClass} ${className}`}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {buttonContent}
    </button>
  );
}
