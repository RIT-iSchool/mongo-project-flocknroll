const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3002;

app.use(cors());

const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
    .then(() => console.log("MongoDB Connected!"))
    .catch(err => console.error(err));

const db = client.db('flock');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

app.get('/', async (req, res) => {
    const users = db.collection('users');
    const result = await users.find({}).toArray();
    res.send(result);
});

app.get('/stateBoundaries', async (req, res) => {
    const states = db.collection('states');
    const result = await states.find({}).toArray();
    console.log(result);
    res.send(result);
});

app.post('/saveUser', async (req, res) => {
    data = req.body

    if (!data.name || !data.email || !data.password) {
        res.send("Invalid SignUp Request!")
    } else {
        const users = db.collection('users');
        const fetchUser = await users.findOne({
            email: data.email
        });

        if (!fetchUser) {
            const result = await users.insertOne({
                name: data.name,
                email: data.email,
                password: data.password
            });
            res.send("User Created!");
        } else {
            res.send("User with provided Email already exists!")
        }
    }
});

app.post('/getUser', async (req, res) => {
    data = req.body

    if (!data.email || !data.password) {
        res.status(400).json({ message: "Invalid Login Request!" });
    } else {
        const users = db.collection('users');
        const result = await users.findOne({
            email: data.email,
            password: data.password
        });

        if (!result) {
            res.status(401).json({ message: "Invalid User Credentials!" });
        } else {
            res.status(200).json({ message: "Login Successful!", data: result });
        }
    }
});

