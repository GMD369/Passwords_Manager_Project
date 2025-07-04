const express = require('express')
const cors=require('cors')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()


// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop'
const app = express()
const port = 3000
app.use(bodyparser.json())
app.use(cors())
client.connect();

// get all passwords
app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
})

// save a password
app.post('/', async (req, res) => {
  const password=req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.insertOne(password);
  res.send({success: true})
})

// delete a password
app.delete('/', async (req, res) => {
  const password=req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.deleteOne(password);
  res.send({success: true})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})