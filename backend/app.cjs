const express = require('express');
const {connectToDb, getDb} = require('./db.js');
const app = express();


let db
connectToDb((err)=>{
  if (!err){
    app.listen(4000, ()=> console.log(`Server listening on port 4000`));
  }
  db=getDb()
})
app.get("/MyCharacter", (req, res) => {
  db.collection("MyCharacter").find()
  res.json({msg: "welcome"});
})