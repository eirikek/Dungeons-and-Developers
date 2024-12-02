import axios from 'axios';
import Class from '../graphql/model/Class.ts';
import Joi, { valid } from 'joi';
import { classesValidationSchema } from '../utils/validationSchemas.js';

const url = { classes: 'https://www.dnd5eapi.co/api/classes' };

async function fetchClasses() {
  let classes;
  try {
    const { data } = await axios.get(url.classes);
    classes = data.results;
  } catch (error) {
    console.error('Failed to fetch classes', error);
    return;
  }
  const processedClasses = await Promise.all(
    classes.map(async (classItem: any) => {
      let classDetails;
      try {
        classDetails = await axios.get(`${url.classes}/${classItem.index}`);
      } catch (error) {
        console.error(`Failed to fetch details for class: ${classItem.name}`);
        return null;
      }
      const inDB = await Class.findOne({ index: classDetails.data.index });

      if (!inDB) {
        const proficiencyChoices = classDetails.data.proficiency_choices?.find(
          (choice: any) => choice.type === 'proficiencies'
        );

        const skills = proficiencyChoices
          ? proficiencyChoices.from.options.map((option: any) => option.item.name.replace('Skill: ', ''))
          : [];

        const newClass = {
          index: classDetails.data.index,
          name: classDetails.data.name,
          hit_die: classDetails.data.hit_die,
          skills: skills,
        };

        const { error, value } = classesValidationSchema.validate(newClass);
        if (error) {
          console.error(`Validation error for class: ${classDetails.data.name}`, error);
          return;
        }
        return value;
      }
    })
  );

  const validClasses = processedClasses.filter((classData: any) => classData != null);
  validClasses.sort((a: any, b: any) => a.name.localeCompare(b.name));
  for (const classData of validClasses) {
    try {
      await new Class(classData).save();
      console.log(`Class saved: ${classData.name}`);
    } catch (error) {
      console.error(`Failed to save class ${classData.name}`, error);
    }
  }
  console.log('All classes saved to MongoDB!');
}
export default fetchClasses;
