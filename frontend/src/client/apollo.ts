import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ReviewType } from '../interfaces/ReviewProps.ts';

/**
 * Apollo Client for interacting with GraphQL server
 * Implements authorization, caching
 * **/
const httpLink = createHttpLink({
  uri: 'http://it2810-20.idi.ntnu.no:3001/graphql',
});
/**
 * Configures authorization by given the 'Bearer' token to the request header.
 **/
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * Apollo Client configuration.
 * With custom cache behaviour for types and fields.
 * Implements custom Merge behaviours
 **/
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
