import Navbar from '../../components/Navbar/Navbar.tsx';
import text_logo from '../../assets/text_logo.png';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full h-screen bg-black">
        <header
          className="w-full h-3/4 bg-home_bg bg-cover bg-center bg-black bg-opacity-50 bg-blend-overlay flex items-center justify-center relative">

          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(to bottom, transparent 80%, black 100%)',
            }}
          ></div>

          <img
            src={text_logo}
            alt="text_logo"
            className="relative z-20 object-contain shadow-none p-8"
          />

        </header>

        <section className="w-full bg-black">
        </section>
      </main>
    </>
  );
}