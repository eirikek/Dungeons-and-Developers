import axios from 'axios';
import mongoose from 'mongoose';
import Class from '../model/Class.ts';

const classesURL = 'https://www.dnd5eapi.co/api/classes';
const mongoUri = 'mongodb://admin:adminpassordetditt@it2810-20.idi.ntnu.no:27017/Profile?directConnection=true&authSource=admin&appName=mongosh+2.3.2';


//interface ProficiencyChoice {
  //desc: string;

//}

async function fetchClasses() {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    const { data } = await axios.get(classesURL);
    const classes = data.results;


    for (const classs of classes) {
      const classDetails = await axios.get(`${classesURL}/${classs.index}`)



      const inDB = await Class.findOne({ index: classDetails.data.index })

      if (!inDB) {
        //ChatGpt lin 31 to 34
        //const profChoice: string[] = Array.isArray(classDetails.data.proficiency_choices)
        //  ? classDetails.data.proficiency_choices.map((choice: ProficiencyChoice) => choice.desc)
        //  : [];
        const classDocument = new Class({
          index: classDetails.data.index,
          name: classDetails.data.name,
          hit_die: classDetails.data.hit_die,
          //proficiency_choices: profChoice,
          //image: imageUrl,
        });

        await classDocument.save();
        console.log(`class saved: ${classDetails.data.name}`);
      }
      //}
    }

    console.log('All class saved to MongoDB!');
  } catch (error) {
    console.error('Error fetching or saving class:', error);
  }

}

fetchClasses().then(() => console.log('Class is fetched'));

export default fetchClasses;