import { useEffect, useState } from 'react';


export default function loginPage() {
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
      <main
        className="relative flex items-center justify-center h-screen z-0 before:absolute before:inset-0 before:bg-terrain before:bg-cover before:bg-center before:animate-background-zoom  before:z-0">
    <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
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