import Navbar from '../../components/Navbar/Navbar.tsx';
import text_logo from '../../assets/text_logo.png';

export default function Home() {
  return (
    <>
      <Navbar />
      <header
        className="w-full h-screen bg-home_bg bg-cover bg-center bg-black bg-opacity-40 bg-blend-overlay flex items-center justify-center relative">

        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, black 100%)',
          }}
        ></div>

        <img
          src={text_logo}
          alt="text_logo"
          className="relative z-20 object-contain shadow-none p-8"
        />

      </header>
      <main className="w-full h-screen bg-black flex flex-col items-center">
        <section className="w-4/5">
          <h1 className="text-5xl">How to play</h1>
        </section>
      </main>
    </>
  );
}