const {MongoClient} = require('mongodb');

let dbConnection

module.exports = {
  connectToDb: (cb) =>{
    MongoClient.connect('mongodb://admin:adminpassordetditt@it2810-20.idi.ntnu.no:27017/?directConnection=true&authSource=admin&appName=mongosh+2.3.2/Profile')
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