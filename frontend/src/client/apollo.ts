import { ApolloClient, createHttpLink, InMemoryCache, Reference } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  connectToDevTools: true,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          user: {
            merge(existing = {}, incoming) {
              return { ...existing, ...incoming };
            },
          },
        },
      },
      User: {
        fields: {
          favoritedMonsters: {
            merge(existing: Reference[] = [], incoming: Reference[], { readField }) {
              const existingIDs = new Set(existing.map((monster) => readField<string>('id', monster)));
              return [...existing, ...incoming.filter((monster) => !existingIDs.has(readField<string>('id', monster)))];
            },
          },
        },
      },
    },
  }),
});

export default client;
