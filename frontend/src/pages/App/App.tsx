import { useState, useEffect } from 'react';
import './App.css';
import Navbar from '../../components/Navbar/Navbar';

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

function App() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) =>
          prevIndex === quotes.length - 1 ? 0 : prevIndex + 1,
        );
        setFade(true);
      }, 500);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main
        className="relative flex items-center justify-center h-screen bg-terrain bg-cover bg-center before:absolute before:inset-0 before:bg-black before:opacity-70 before:z-0">
        <section className="w-full h-3/4 relative z-10 flex flex-col items-center justify-around">
          <header>
            <h1
              className={`text-5xl text-white transition-opacity duration-500 ${
                fade ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {quotes[currentQuoteIndex]}
            </h1>
          </header>
          <section className="flex flex-col items-center gap-5">
            <h2 className="text-3xl text-white mb-5">Log in to continue your adventure</h2>
            <input id="log-in-input" className="text-2xl w-96 p-2 border-2 rounded bg-transparent text-center"
                   placeholder="Username"></input>
            <button className="relative group text-3xl pb-1">
              Log in
              <span
                className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </button>
          </section>
          <section className="flex flex-col items-center gap-5">
            <h2 className="text-3xl text-white mb-5">Or register to start a new one</h2>
            <input id="register-input" className="text-2xl w-96 p-2 border-2 rounded bg-transparent text-center"
                   placeholder="Username"></input>
            <button className="relative group text-3xl pb-1">
              Register
              <span
                className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </button>
          </section>
        </section>
      </main>
    </>
  );
}

export default App;