const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { request } = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjeek.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const reviewCollection=client.db('manufacturer').collection('review');

         //get all review
         app.get('/review', async(req,res) =>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews=await cursor.toArray();
            res.send(reviews);
        });

         //add new review
         app.post('/review',async(req,res) =>{
            const newReview=req.body;
            console.log('Adding new review', req.body);
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        });
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("manufacturer CRUD server");
})

app.listen(port,() =>{
    console.log('manufacturer server is up and running');
})