import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const quotes = [
  'In the heart of every adventure, lies the soul of a hero.',
  'Roll the dice and forge your destiny.',
  'Fate may guide us, but courage decides our path.',
  'Imagination is the only limit to the worlds we create.',
  'A dungeon is not just a place of danger, but a crucible of heroes.',
  'It’s not the sword that makes the hero, but the heart behind it.',
  'In the darkest moments, even a flicker of light can lead to victory.',
  'Every choice is a roll of the dice, every consequence, a new chapter.',
  'The adventure never ends, as long as there’s a story to tell.',
  'Cunning, bravery, and the right spell can turn the tide of any battle.',
];

export default function LoginPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [username, setUsername] = useState(''); // Add state for the username input
  const [isLoggingIn, setIsLoggingIn] = useState(true); // Add state to toggle between login and register
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate to handle navigation

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex === quotes.length - 1 ? 0 : prevIndex + 1));
        setFade(true);
      }, 500);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRegister = async () => {
    // Add your registration logic here (use fetch to send a request to the backend)
    if (!username) {
      setErrorMessage('Username is required');
      return;
    }

    // Simulating successful registration
    setErrorMessage('');
    alert(`User "${username}" registered!`);
    setIsLoggingIn(true); // Switch to login mode after registering
  };

  const handleLogin = async () => {
    // Add your login logic here (use fetch to send a request to the backend)
    if (!username) {
      setErrorMessage('Username is required');
      return;
    }

    // Simulating successful login
    setErrorMessage('');
    setFade(false); // Trigger fade out
    setTimeout(() => {
      navigate('/project2/dungeon'); // Redirect to DungeonPage after login
    }, 500); // Delay navigation to allow the fade out effect
  };

  return (
    <>
      <main
        className={`relative flex items-center justify-center h-screen z-0 before:absolute before:inset-0 before:bg-terrain before:bg-cover before:bg-center before:animate-background-zoom before:z-0 ${fade ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        <section className="w-full h-3/4 relative z-10 flex flex-col items-center justify-around">
          <header>
            <h1 className="text-5xl text-white">
              {quotes[currentQuoteIndex]}
            </h1>
          </header>
          <section className="flex flex-col items-center gap-5">
            <h2 className="text-3xl text-white mb-5">
              {isLoggingIn ? 'Log in to continue your adventure' : 'Register to start a new one'}
            </h2>
            <input
              id="log-in-input"
              className="text-2xl w-96 p-2 border-2 rounded bg-transparent text-center"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={isLoggingIn ? handleLogin : handleRegister}
              className="relative group text-3xl pb-1"
            >
              {isLoggingIn ? 'Log in' : 'Register'}
              <span
                className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              onClick={() => setIsLoggingIn(!isLoggingIn)}
              className="text-xl text-white mt-5"
            >
              {isLoggingIn ? 'Switch to Register' : 'Switch to Login'}
            </button>
          </section>
        </section>
      </main>
    </>
  );
}