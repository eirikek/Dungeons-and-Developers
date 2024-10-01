import MonsterCard from './components/MonsterCard/MonsterCard.tsx';
import mockup from '../../frontend/src/data/mockup.ts';

const monsterNameArray: string[] = [];

mockup.results.forEach((result) => {
  monsterNameArray.push(result.index);
});

const monsterNameArray20: string[] = monsterNameArray.slice(0, 40);

function App() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {monsterNameArray20.map((name, index) => (
          <MonsterCard monsterName={name} key={index} />
        ))}
      </div>
    </>
  );
}

export default App;
