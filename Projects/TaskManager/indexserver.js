const express = require('express');
const app = express();
const port = 8289;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  app.get('/index.js', (req, res) => {
    res.sendFile(__dirname + '/index.js');
  });
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  app.post('/Save', (req, res) => {
    const collectionName = req.body.collectionName;
    const tableDataSave = req.body.tableData;

    const database = client.db('City');
    const collection = database.collection(collectionName);

    collection.updateOne({}, { $set: { tabledata: tableDataSave } }, { upsert: true }, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            if (result.upserted) {
                res.json({ message: "Save overwritten" });
            } else {
                res.json({ message: "Task has been saved" });
            }
        }
    });
 });
app.post('/Load',async (req, res) => {
  const collectionName = req.body.collectionName;
  const database = client.db('City');
  const collection = database.collection(collectionName);


  const collections = await database.listCollections().toArray();
  const foundCollection = collections.find(collection => collection.name == collectionName);

  if (foundCollection) {
   const data = await collection.findOne({})
   res.json(data)
   
  } else {

    console.log("no")
  }
});

