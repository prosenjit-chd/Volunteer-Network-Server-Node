const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ocrjv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('volunteer-network');
        const volunteersCollection = database.collection('volunteers');
        const usersCollection = database.collection('users');

        // GET API
        app.get('/volcollection', async (req, res) => {
            const cursor = volunteersCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let volunteers = [];
            const count = await cursor.count();
            if (page) {
                volunteers = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                volunteers = await cursor.toArray();
            }
            res.send({
                count,
                volunteers
            });
        })
        app.get('/volcollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const volunteer = await volunteersCollection.findOne(query);
            res.send(volunteer);
        })
        // POST API
        // app.post('/students', async (req, res) => {
        //     const newStudent = req.body;
        //     const result = await studentsCollection.insertOne(newStudent);
        //     res.json(result);
        // })
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.json(result);
        })
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            users = await cursor.toArray();
            res.send(users);
        })
        // // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })

        // // UPDATE API
        // app.put('/students/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updateStudent = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upset: true };
        //     const updateDoc = {
        //         $set: {
        //             name: updateStudent.name,
        //             email: updateStudent.email
        //         },
        //     }
        //     const result = await studentsCollection.updateOne(filter, updateDoc, options);
        //     console.log(result);
        //     res.json(result);
        // })
        // // DELETE API
        // app.delete('/students/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await studentsCollection.deleteOne(query);
        //     res.json(result);
        // })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('This is home');
});

app.get('/test', (req, res) => {
    res.send('This is test');
});

app.listen(port, () => {
    console.log('server is up and running at', port);
})