// setup express
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(cors());

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
    const orders_collection = db.collection('orders');
    const users_collection = db.collection('users');
    const review_collection = db.collection('reviews');

    // post request for product
    app.post('/products', async (req, res) => {
      const products = req.body;
      const result = await products_collection.insertOne(products);
      res.send(result);
    });

    // post order
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await orders_collection.insertOne(orders);
      res.send(result);
    });

    // post users
    app.post('/user', async (req, res) => {
      const users = req.body;
      const result = await users_collection.insertOne(users);
      res.send(result);
    });

    // post user review
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await review_collection.insertOne(review);
      res.send(result);
    });

    // put request for users
    app.put('/user', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await users_collection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // make an admin
    app.put('/user/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };

      const updateDoc = {
        $set: {
          role: 'Admin',
        },
      };
      const result = await users_collection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // get all products
    app.get('/products', async (req, res) => {
      const products = await products_collection.find().toArray();
      res.send(products);
    });

    // get the admin user
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await users_collection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'Admin') {
        isAdmin = true;
      }

      res.send({ Admin: isAdmin });
    });

    // get user orders
    app.get('/orders/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = orders_collection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // get all orders
    app.get('/allorders', async (req, res) => {
      const orders = await orders_collection.find().toArray();
      res.send(orders);
    });

    // delete orders by user
    app.delete('/orders/:id', async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await orders_collection.deleteOne(query);
      res.send(result);
    });

    // update orders status
    app.put('/order/update/:id', async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { status },
      };
      const result = await orders_collection.updateOne(query, updateDoc);
      res.send(result);
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
