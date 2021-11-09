// user: assignment-12
// pass: 3nXkWgiThKSmHOyE

// setup express
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(cors());

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wn1l6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// create async function named run
async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('myFirstDatabase');
    const collection = db.collection('users');
  } finally {
    //
  }
}

run().catch(console.dir);

// simple get request
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// listen to port
app.listen(port, () => console.log(` app listening on port ${port}!`));