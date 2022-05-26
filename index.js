const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const toolsCollection=client.db('manufacturer').collection('parts');
        const userCollection=client.db('manufacturer').collection('users');

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
        //get all tools
        app.get('/tools', async(req,res) =>{
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools=await cursor.toArray();
            res.send(tools);
        });

        //get tools with id
        app.get('/tool/:id', async(req,res) =>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            
            const tool=await toolsCollection.findOne(query);
            res.send(tool);
        });

        //save/update user info
        app.put('/user/:email',async(req,res)=>{
            const email=req.params.email;
            const user=req.body;
            const filter={email:email};
            const options = { upsert: true };

            const updateDoc = {
                $set: user,
              };

              const result = await userCollection.updateOne(filter, updateDoc, options);
              res.send(result);
        })


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