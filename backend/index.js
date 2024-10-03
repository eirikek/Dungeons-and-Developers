import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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

// Initialize the Neo4j driver
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'adminadmin'),
);

// Define resolvers for Queries and Mutations
const resolvers = {
  Query: {
    monster: async (_, { index }) => {
      try {
        const response = await axios.get(
          `https://www.dnd5eapi.co/api/monsters/${index}/`,
        );
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
        const id = uuidv4(); // Generate a unique UUID
        const result = await session.run(
          `
          CREATE (u:User {id: $id, username: $username})
          RETURN u
          `,
          { id, username },
        );
        return result.records[0].get('u').properties;
      } finally {
        await session.close(); // Close the session after operation
      }
    },
  },
};


// Create the Neo4jGraphQL instance with resolvers and driver
const neoSchema = new Neo4jGraphQL({ typeDefs, resolvers, driver });

async function startServer() {
  const schema = await neoSchema.getSchema(); // Generate the schema

  // Initialize Apollo Server with the schema
  const server = new ApolloServer({
    schema, // Use the generated schema
  });

  // Start the server with context passed to startStandaloneServer
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }, // Listen on port 4000
    context: ({ req }) => ({
      driver, // Pass the driver in the context for session handling
      req,    // Include request if needed
    }),
  });

  console.log(`Server ready at ${url}`);
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});