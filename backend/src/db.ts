import { Db, MongoClient } from 'mongodb';

const MONGODBURLPROFILE = 'mongodb://admin:adminpassordetditt@it2810-20.idi.ntnu.no:27017/Profile?directConnection=true&authSource=admin&appName=mongosh+2.3.2';

let dbConnection: Db |null = null;



export const connect = async () => {
  try{
    const client = await MongoClient.connect(MONGODBURLPROFILE);
    dbConnection = client.db();
    console.log('MongoDB connected');
  } catch(error){
      console.log('MongoDB not connected', error);
      throw error;
  }
}

export const getDBConnection = () :Db=> {
  if (!dbConnection) {
    console.log('MongoDB connection not found');
  }
  return dbConnection
}
