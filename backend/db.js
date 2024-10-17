const {MongoClient} = require('mongodb');

let dbConnection

module.exports = {
  connectToDb: (cb) =>{
    MongoClient.connect('')
      .then((client)=>{
        dbConnection = client.db()
        return cb()
      })

      .catch(error=>{
        console.log(error)
        return cb(error)
      })
  },
  getDb:() => dbConnection,
}