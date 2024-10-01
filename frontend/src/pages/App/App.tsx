import { useState, useEffect } from "react";
import './App.css';

const quotes = [
  "In the heart of every adventure, lies the soul of a hero.",
  "Roll the dice and forge your destiny.",
  "Fate may guide us, but courage decides our path.",
  "Imagination is the only limit to the worlds we create.",
  "A dungeon is not just a place of danger, but a crucible of heroes.",
  "It’s not the sword that makes the hero, but the heart behind it.",
  "In the darkest moments, even a flicker of light can lead to victory.",
  "Every choice is a roll of the dice, every consequence, a new chapter.",
  "The adventure never ends, as long as there’s a story to tell.",
  "Cunning, bravery, and the right spell can turn the tide of any battle.",
];

function App() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) =>
          prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
        );
        setFade(true);
      }, 500);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="flex items-center justify-center h-screen">
        <section className="text-center">
          <h1
            className={`text-4xl text-white transition-opacity duration-500 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {quotes[currentQuoteIndex]}
          </h1>
        </section>
      </main>
    </>
  );
}

export default App;