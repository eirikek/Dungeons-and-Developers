import MonsterCard from './components/MonsterCard/MonsterCard.tsx';
import mockup from '../../frontend/src/data/mockup.ts';

const monsterNameArray: string[] = [];

mockup.results.forEach((result) => {
  monsterNameArray.push(result.index);
});

function App() {
  return (
    <>
      <div className="flex m-5 gap-5">
        {monsterNameArray.map((name, index) => (
          <MonsterCard monsterName={name} key={index} />
        ))}
      </div>
    </>
  );
}

export default App;
