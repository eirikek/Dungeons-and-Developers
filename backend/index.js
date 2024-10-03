import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';

const typeDefs = `
  type User {
    username: String!
  }

  type Query {
    userExists(username: String!): Boolean!
    login(username: String!): Boolean!
  }

  type Mutation {
    register(username: String!): User
  }
`;

const driver = neo4j.driver('bolt://localhost:7800', neo4j.auth.basic('admin', 'admin'));

const resolvers = {
  Query: {
    // Check if a user already exists
    userExists: async (_, { username }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (u:User {username: $username}) RETURN u',
        { username },
      );
      session.close();
      return result.records.length > 0;
    },
    // Log in: Just check if the user exists for now
    login: async (_, { username }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (u:User {username: $username}) RETURN u',
        { username },
      );
      session.close();
      return result.records.length > 0;
    },
  },
  Mutation: {
    // Register a new user
    register: async (_, { username }) => {
      const session = driver.session();
      const result = await session.run(
        'CREATE (u:User {username: $username}) RETURN u',
        { username },
      );
      session.close();
      return { username };
    },
  },
};

const neoSchema = new Neo4jGraphQL({ typeDefs, resolvers, driver });

const schema = await neoSchema.getSchema();
const server = new ApolloServer({
  schema,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at ${url}`);
