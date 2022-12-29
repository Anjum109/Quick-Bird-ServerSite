const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jjbnacp.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const usersCollection = client.db('quickBird').collection('users');
        const postCollection = client.db('quickBird').collection('posts');
        const commentCollection = client.db('quickBird').collection('comments');


        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            user._id = result.insertedId;
            res.send(result);
        });
        app.post('/posts', async (req, res) => {
            const service = req.body;
            const result = await postCollection.insertOne(service);
            res.send(result);
        })
        app.get('/posts', async (req, res) => {
            const query = {}
            const cursor = postCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        });
        app.post('/comments', async (req, res) => {
            const comments = req.body;
            const result = await commentCollection.insertOne(comments);
            res.send(result);
        });
        app.get('/comments', async (req, res) => {
            const query = {}
            const cursor = commentCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        });


    }
    finally {

    }
}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('quick bird server is running')
});
app.listen(port, () => { console.log(`quick bird running ${port}`) })