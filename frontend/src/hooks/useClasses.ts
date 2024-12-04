import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import ClassData from '../interfaces/ClassProps.ts';
import { GET_CLASSES } from '../graphql/queries/classQueries.ts';
import { handleError } from '../utils/handleError.ts';

function useClass(currentPage: number, classesPerPage: number, shouldFetch: boolean) {
  const offset = (currentPage - 1) * classesPerPage;

  const { data, error, loading } = useQuery<{
    classes: { classes: ClassData[]; totalClasses: number };
  }>(GET_CLASSES, {
    variables: { offset, limit: classesPerPage },
    skip: !shouldFetch,
    fetchPolicy: 'cache-and-network',
  });

  const transformedClasses = useMemo(() => {
    if (loading) {
      return [];
    }

    if (error) {
      handleError(error, 'Error fetching classes', 'critical');
      return [];
    }

    if (!data || !data.classes) {
      if (!shouldFetch) return [];

      handleError(null, 'No data received for abilities after loading', 'warning');
      return [];
    }
    return data.classes.classes.map((classs) => ({
      id: classs.id,
      index: classs.index,
      name: classs.name,
      hit_die: classs.hit_die,
      skills: classs.skills,
    }));
  }, [data, error, loading, shouldFetch]);

  return {
    classes: transformedClasses,
    totalClasses: data?.classes.totalClasses || 0,
    loading,
    error,
  };
}

export default useClass;
