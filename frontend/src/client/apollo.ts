import { ApolloClient, createHttpLink, InMemoryCache, Reference } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import MonsterGraphQL from '../interfaces/MonsterDataProps.ts';

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
            keyArgs: ['id'],
            merge(existing = {}, incoming) {
              return { ...existing, ...incoming };
            },
          },
        },
      },
      User: {
        keyFields: ['id'],
        fields: {
          favoritedMonsters: {
            merge(existing = [], incoming: MonsterGraphQL[]) {
              const existingIds = new Set(existing.map((monster: MonsterGraphQL) => monster.id));
              return [...existing, ...incoming.filter((monster) => !existingIds.has(monster.id))];
            },
          },
          dungeonName: {
            merge(existing = '', incoming) {
              return incoming;
            },
          },
        },
      },
      Monster: {
        keyFields: ['id'],
      },
    },
  }),
});

export default client;
