import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ReviewType } from '../interfaces/ReviewProps.ts';

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
  devtools: {
    enabled: true,
  },
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
            merge: false,
          },
          dungeonName: {
            merge: false,
          },
          class: {
            merge(_, incoming) {
              return incoming;
            },
          },

          race: {
            merge(_, incoming) {
              return incoming;
            },
          },
          equipments: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      Class: {
        keyFields: ['name'],
      },
      Race: {
        keyFields: ['name'],
      },
      Ability: {
        keyFields: ['id'],
      },
      Equipment: {
        keyFields: ['name'],
      },
      Monster: {
        keyFields: ['id'],
        fields: {
          reviews: {
            merge(existing = [], incoming) {
              const mergedReviews = [...existing];
              incoming.forEach((incomingReview: ReviewType) => {
                if (!mergedReviews.some((review) => review.id === incomingReview.id)) {
                  mergedReviews.push(incomingReview);
                }
              });
              return mergedReviews;
            },
          },
        },
      },
      Review: {
        keyFields: ['id'],
      },
    },
  }),
});

export default client;
