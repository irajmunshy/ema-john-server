const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrnpv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('hello world');
})


client.connect(err => {
    // const productsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ITEM}`);
    const productsCollection = client.db("ema-john-shoping-mall").collection("products");
    const orderCollection = client.db("ema-john-shoping-mall").collection("order");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
       
        productsCollection.insertOne(products)
        .then(result => {
            res.send(result.insertCount);
        })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, document) => {
            res.send(document[0]);
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = res.body;
        productsCollection.find({key: {$in: productKeys} })
            .toArray((err, document) => {
                res.send(document);
                // console.log(document)
            })
    })


    // ////
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
        .then(result => {
            res.send(result.insertCount > 0);
        })
    })


//   client.close();
});


app.listen(5000);