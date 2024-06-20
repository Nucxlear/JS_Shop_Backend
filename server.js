const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

async function getDbCollection(dbAdress, dbName, dbCollectionName){
    const client = new MongoClient(dbAdress);
    await client.connect();
    const db = client.db(dbName);
    return db.collection(dbCollectionName)
}

app.get('/products', async function(req, res){
    const collection = await getDbCollection('mongodb://127.0.0.1', 'shopDB', 'test_collection');
    const data = await collection.find({}).toArray();
    res.send(data);
});

app.get('/products/:id', async function(req, res){
    const collection = await getDbCollection('mongodb://127.0.0.1', 'shopDB', 'test_collection');
    const data = await collection.findOne({_id: new ObjectId(req.params.id)});
    res.send(data);
});

app.post('/products', async function(req, res){
    const product = {...req.body}
    const collection = await getDbCollection('mongodb://127.0.0.1', 'shopDB', 'test_collection');
    await collection.insertOne(product);
    res.send(product);
});

app.patch('/products/:id', async function(req, res){
    const collection = await getDbCollection('mongodb://127.0.0.1', 'shopDB', 'test_collection');
    const data = await collection.updateOne({_id: new ObjectId(req.params.id)},
                                            {'$set': req.body});
    res.send(data);
});

app.delete('/products/:id', async function(req, res){
    const collection = await getDbCollection('mongodb://127.0.0.1', 'shopDB', 'test_collection');
    await collection.deleteOne({_id: new ObjectId(req.params.id)});
    res.send({});
});

app.listen(port, function() {
    console.log('Server is started');
});