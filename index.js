const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://oldGolden:wvPUr43ENP0cVF2c@cluster0.qhhqtot.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {



    try {


        const adressBook = client.db('oldGolden').collection('adress');

        app.post('/adress', async (req, res) => {
            const adress = req.body;
            const result = await adressBook.insertOne(adress)
            res.send(result);
        })

        // JWT 
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });


        // GET ALL CONTACTS 
        app.get('/adress', async (req, res) => {
            const query = {};
            const contacts = await adressBook.find(query).toArray();
            res.send(contacts);
        });


        // GET SINGLE CONTACTS 
        app.get('/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const contacts = await adressBook.findOne(query);
            res.send(contacts);
        });



        app.put('/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.number,
                    name: user.name,
                    currentCity: user.CurrentCity

                }
            }
            const result = await adressBook.updateOne(filter, updatedUser, option);
            res.send(result);
        })


        // DELETE CONTACTS 
        app.delete('/contacts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adressBook.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }



}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('server is running ')
})

app.listen(port, () => console.log(`server is running ${port}`))