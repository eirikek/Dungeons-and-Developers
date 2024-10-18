const express = require('express');
const {connectToDb, getDb} = require('./db.cjs');
const app = express();



let db
connectToDb((err)=>{
  if (!err){
    app.listen(4000, ()=> {
      console.log(`Server listening on port 4000`)
    })
    db=getDb()
    console.log(db)
  }

})

app.get('/MyCharachter', (req, res)=>{
  let players = []

  db.collection('MyCharachter')
    .find()
    .sort({username:1})
    .forEach(player=>players.push(player))
    .then(()=>{
      res.status(200).json(players)
      console.log(db)
    })
    .catch(()=>{
      res.status(500).json({error: 'Something went wrong'})
    })
})
