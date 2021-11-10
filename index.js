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
    const db = client.db('my_bicycle_website');
    const products_collection = db.collection('products');

    // post request for product
    app.post('/products', async (req, res) => {
      const products = req.body;
      const result = await products_collection.insertOne(products);
      res.send(result);
    });

    // get all products
    app.get('/products', async (req, res) => {
      const products = await products_collection.find().toArray();
      res.send(products);
    });
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
