import fetchMonsters from './fetchMonsters.ts';
import fetchRaces from './fetchRaces.ts';
import fetchClasses from './fetchClasses.ts';
import fetchAbilityScores from './fetchAbilityScores.ts';
import fetchEquipments from './fetchEquipments.ts';

async function fetchData() {
  try {
    await fetchMonsters();
    await fetchRaces();
    await fetchClasses();
    await fetchAbilityScores();
    await fetchEquipments();
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
}

export default fetchData;
