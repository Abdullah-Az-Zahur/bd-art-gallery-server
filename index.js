const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbrjeuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const artCollection = client.db('artDB').collection('art');

    app.get('/items', async(req, res)=>{
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/items/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await artCollection.findOne(query);
      res.send(result)
    })

    app.get('/myItems/:email', async (req, res)=>{
      const email =(req.params.email);
      const result = await artCollection.find({userEmail: email}).toArray();
      // console.log(result)
      res.send(result)
      
    })

    app.post('/items', async(req, res)=>{
      const newArt = req.body;
      console.log(newArt);
      const result = await artCollection.insertOne(newArt);
      res.send(result);
    })

    app.put('/items/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedItem = req.body;
      const item = {
          $set: {
            name: updatedItem.name,
            price: updatedItem.price,
            subcategory: updatedItem.subcategory,
            shortDescription: updatedItem.hortDescription,
            rating: updatedItem.rating,
            customization: updatedItem.customization,
            stockStatus: updatedItem.stockStatus,
            photo: updatedItem.photo,
        }
      }

      const result = await artCollection.updateOne(filter, item, options);
      res.send(result);
    })

    app.delete('/items/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await artCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('bd art server is running')
})

app.listen(port, ()=>{
    console.log(`bd art server is running on port : ${port}`)
})
