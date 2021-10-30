const express = require ('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const res = require('express/lib/response');
require('dotenv').config();


const app = express ();
const port =  process.env.PORT || 5000;

//Middle Ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.98ro8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log (uri)
async function run () {
 try {
   await client.connect();
   const database = client.db('hotels_booking');
   const servicesCollection = database.collection('services');

//Post API 
app.post('/services', async(req, res) =>{
    const service = req.body;
    console.log ('hit the api', service);
    const result = await servicesCollection.insertOne(service)
    console.log(result);
    res.json(result);
});


// Get Bookings API
app.get('/services', async(req, res)=>{
   const cursor = servicesCollection.find({});
   const services = await cursor.toArray();
   res.send(services);
})

// //Get a Single Service 
app.get('/services/:id', async(req,res)=>{
const id =req.params.id;
console.log('getting specific service', id);
const query = {_id: ObjectId(id)};
const service = await servicesCollection.findOne(query);
res.json(service)
})

//Delete API 
app.delete('/services/:id', async(req,res) =>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await servicesCollection.deleteOne(query);
    res.json(result);
})


 }
 finally{
    //  await client.close();
 }
}

run().catch(console.dir)

app.get('/', (req, res) =>{
    res.send ('Hotel Booking is running');
});

app.listen(port, ()=>{
    console.log('server running at port', port);
})