const express = require('express');
const {connectToDb, getDb} = require('./db.cjs');
const { ObjectId } = require('mongodb');
const app = express();
app.use(express.json());


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

app.get('/MyCharachter/:username', (req, res)=>{
  db.collection('MyCharachter')
    .findOne({username:req.params.username})
    .then(usernames => {
      res.status(200).json(usernames)
    })
    .catch(err => res.status(500).json({error: 'Something went wrong'}))
})

//I don't understand why it won't work...
app.get('/MyCharachter/:userID', (req, res)=>{
  db.collection('MyCharachter')
    .findOne({userID: req.params.userID})
    .then(ids => {
      res.status(200).json(ids)
    })
    .catch(err => res.status(500).json({error: 'Something went wrong'}))
})

app.post('/MyCharachter', (req, res)=>{
  const player = req.body
  db.collection('MyCharachter')
    .insertOne(player)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {res.status(500).json({error: 'Something went wrong'})})

})
