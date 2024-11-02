import express from 'express';
import { ApolloServer } from '@apollo/server';
import mongoose from 'mongoose';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import cors from 'cors';

import typeDefs from './graphql/typeDefs/index.ts';
import resolvers from './graphql/resolvers/index.ts';
import fetchData from './scripts/fetchData.ts';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true,
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>({
    origin: [
      'http://localhost:5173/project2',
      'https://studio.apollographql.com',
      'http://it2810-20.idi.ntnu.no/project2',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server)
);

const MONGODBURLPROFILE =
  'mongodb://admin:adminpassordetditt@it2810-20.idi.ntnu.no:27017/Profile?directConnection=true&authSource=admin&appName=mongosh+2.3.2';

mongoose
  .connect(MONGODBURLPROFILE)
  .then(() => {
    console.log('MongoDB connection established');

    app.listen({ port: 4000 }, () => {
      console.log(`Server is running at http://localhost:4000/graphql`);

      fetchData()
        .then(() => console.log('Data fetching complete'))
        .catch((error) => console.error('Error fetching data:', error));
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
