
const { MongoClient } = require('mongodb');
const CONNECTION_STRING = process.env.CONNECTION_STRING; 
const DATABASENAME = process.env.DATABASE;
const client = new MongoClient(CONNECTION_STRING);
let db = '';
let collection = '';
const callDB = async(coll) => {
  try {
    await client.connect();
    db = client.db(DATABASENAME);
    collection = db.collection(coll); 
    console.log('Mongo DB Connection V2 Successful');
    return collection;
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
module.exports = {callDB}