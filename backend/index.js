import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import axios from 'axios';

// Define the schema
const typeDefs = `
  type Monster {
    name: String!
    hit_points: Int!
    size: String!
    alignment: String!
    image: String
  }

  type User {
    id: ID! @id
    username: String! @unique
  }

  type Query {
    monster(index: String!): Monster
  }

  type Mutation {
    createUser(username: String!): User
  }
`;

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'adminadmin'));

const resolvers = {
  Query: {
    monster: async (_, { index }) => {
      try {
        const response = await axios.get(`https://www.dnd5eapi.co/api/monsters/${index}/`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to get data');
      }
    },
  },
  Mutation: {
    createUser: async (_, { username }, context) => {
      const session = context.driver.session();

      try {
        const result = await session.run(
          `
          CREATE (u:User {username: $username})
          RETURN u
          `,
          { username },
        );
        return result.records[0].get('u').properties;
      } finally {
        await session.close();
      }
    },
  },
};

const neoSchema = new Neo4jGraphQL({ typeDefs });

async function startServer() {
  const schema = await neoSchema.getSchema();

  const server = new ApolloServer({
    schema,
    resolvers,
    context: () => ({
      driver: driver,
    }),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }, // Listen on port 4000
  });

  console.log(`Server ready at ${url}`);
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});