import axios from 'axios';
import Class from '../graphql/model/Class.ts';

const url = { classes: 'https://www.dnd5eapi.co/api/classes' };
async function fetchClasses() {
  const { data } = await axios.get(url.classes);
  const classes = data.results;

  for (const classData of classes) {
    const classDetails = await axios.get(`${url.classes}/${classData.index}`);
    const inDB = await Class.findOne({ index: classDetails.data.index });

    if (!inDB) {
      const proficiencyChoices = classDetails.data.proficiency_choices?.find(
        (choice: any) => choice.type === 'proficiencies'
      );

      const skills = proficiencyChoices
        ? proficiencyChoices.from.options.map((option: any) => option.item.name.replace('Skill: ', ''))
        : [];

      await new Class({
        index: classDetails.data.index,
        name: classDetails.data.name,
        hit_die: classDetails.data.hit_die,
        skills: skills,
      }).save();
      console.log(`Class saved: ${classDetails.data.name}`);
    }
  }
  console.log('All classes saved to MongoDB!');
}
export default fetchClasses;
