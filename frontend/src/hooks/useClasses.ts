import { useMemo} from 'react';
import { gql, useQuery } from '@apollo/client';



const GET_CLASSES = gql`
    query GetClasses($offset: Int, $limit: Int) {
        classes(offset: $offset, limit: $limit) {
            classes {
                index
                name
                hit_die
            }
            totalClasses
        }
    }
`;



//interface ProficiencyChoice {
  //desc: string;

//}

interface ClassData {
  name: string;
  hit_die: number;
  index: string;
  //proficiency_choices: ProficiencyChoice[];
}

function useClass(currentPage: number, classesPerPage: number) {
  const offset = (currentPage - 1) * classesPerPage;

  const { data, error, loading } = useQuery<{
    classes: { classes: ClassData[], totalClasses: number }
  }>(GET_CLASSES, {
    variables: { offset, limit: classesPerPage },
    fetchPolicy: 'network-only',
  });

  console.log('Data from server: ', data);
  console.log(data)

  const transformedClasses = useMemo(() => {
    if (!data || !data.classes) return [];
    return data.classes.classes.map(classs => ({
      index: classs.index,
      name: classs.name,
      hit_die: classs.hit_die,
      //Chatgpt, line 53, to 56
      //proficiency_choices: Array.isArray(classs.proficiency_choices)
      //? classs.proficiency_choices.map((choice: ProficiencyChoice) => choice.desc)
       // : []
    }));
  }, [data]);


  return {
    classes: transformedClasses,
    totalClasses: data?.classes.totalClasses || 0,
    loading,
    error,
  };
}

export default useClass;