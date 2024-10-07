import { Link } from 'react-router-dom';

const CharacterButton = () => {

  return (
    <>
      <section className="flex w-full justify-between p-4 bg-transparent">
      <Link className="text-center w-1/3 mx-2 nav-btn py-2 bg-black hover:w-3/5 transition-all duration-300 rounded opacity-70 text-white text-2xl" to="/project2/race">
        <button
                >Races
        </button>
      </Link>

        <Link className="text-center w-1/3 mx-2 nav-btn px- py-2 bg-black hover:w-3/5 transition-all duration-300 rounded opacity-70 text-white text-2xl" to="/project2/class">

        <button>Classes
        </button>
          </Link>
        <Link className="text-center w-1/3 mx-2 nav-btn px- py-2 bg-black hover:w-3/5 transition-all duration-300 rounded opacity-70 text-white text-2xl" to="/project2/abilityScore">
        <button>Ability Scores
        </button>
        </Link>
        </section>
      </>
      );
      };

      export default CharacterButton;