const express = require('express');
const {connectToDb, getDb} = require('./db.cjs');
const app = express();

app.get("/MyCharacter", (req, res) => {
  let players = []
  db.collection("MyCharacter").find().sort({username:1}).forEach((player)=>
    players.push(player)
  ).then(()=>{
    return res.status(200).json(players)
  }).catch(err=>{
    res.status(500).json({error:err})
  })
})

let db
connectToDb((err)=>{
  if (!err){
    app.listen(4000, ()=> console.log(`Server listening on port 4000`));
  }
  db=getDb()
})
