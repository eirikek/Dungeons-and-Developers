import './App.css';
import Monsters from './components/Monsters/Monsters.tsx';
import { useState } from 'react';
import dataMonsters from './data/mockup.ts';

function App() {
  const [monsters, setMonsters] = useState(dataMonsters.results);

  const handleSetMonsters = () => {
    // code here
  };
  return (
    <>
      <Monsters monsters={monsters} />
    </>
  );
}

export default App;
