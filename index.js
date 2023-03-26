const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();

// Used CORS middleware
app.use(cors());

app.use(express.json())


app.get('/', (req,res)=>{
   res.send("horizon heights server is running")
})


// db connection 

const uri = process.env.DB_ACCESS
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// api endpoints

const run = async ()=>{
   try {
      const roomCollection = client.db('horizoheights').collection('rooms');
      const bookingCollection = client.db('horizoheights').collection('bookings');

      // get request for all rooms data
      app.get('/rooms', async(req,res)=>{
         const query ={}
         const result = await roomCollection.find(query).toArray();
         res.send(result);
      })

      // get request for a single room data
      app.get('/room/:id', async(req,res)=>{
         const query ={_id:new ObjectId(req.params.id)};
         const result = await roomCollection.findOne(query);
         res.send(result);
      })

      // post data in db 
      app.post('/bookings', async (req, res) => {
         const booking = req.body;
         console.log('====================================');
         console.log(booking);
         console.log('====================================');
           // Save data to the database
           const result = await bookingCollection.insertOne(booking);
           console.log('====================================');
           console.log(result);
           console.log('====================================');
           res.send(result);
      })
      
   } catch (error) {
      console.log('====================================');
      console.error(error);
      console.log('====================================');
   } finally {

   }
}
run().catch(err => console.log(err))


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


