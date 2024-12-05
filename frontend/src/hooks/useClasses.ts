import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import ClassData from '../interfaces/ClassProps.ts';
import { GET_CLASSES } from '../graphql/queries/classQueries.ts';
import { handleError } from '../utils/handleError.ts';

/**
 * Custom Hook: `useClasses`
 *
 * Fetches and manages data related to character classes from the server using Apollo Client.
 *
 * Features:
 * - Retrieves classes based on pagination and fetch conditions.
 * - Transforms the raw GraphQL data into a more consumable format.
 * - Handles loading and error states gracefully.
 *
 * @param currentPage - The current page for pagination.
 * @param classesPerPage - The number of classes to fetch per page.
 * @param shouldFetch - A flag to determine whether the query should be executed.
 *
 * @returns An object containing:
 * - `classes`: A transformed array of class data.
 * - `totalClasses`: The total number of classes available.
 * - `loading`: A boolean indicating if the query is in progress.
 * - `error`: Any error that occurred during the query execution.
 *
 * @example
 * ```tsx
 * const { classes, totalClasses, loading, error } = useClass(1, 10, true);
 * if (loading) return <p>Loading...</p>;
 * if (error) return <p>Error loading classes</p>;
 * return classes.map((classData) => <ClassCard key={classData.id} data={classData} />);
 * ```
 */

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
