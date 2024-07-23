const express = require('express');
const connectToMongoDB = require('./mongodb'); // Assuming db.js is in the same directory

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/insert');
});

app.post('/insert', async (req, res) => {
    const { plantName, BName, plantPrice } = req.body;

    try {
        const client = await connectToMongoDB(); // Connect to MongoDB using the function from db.js

        const database = client.db(dbName);
        const collection = database.collection('collection'); // Use the collection name for insert

        const result = await collection.insertOne({
            plantName,
            BName,
            price: parseFloat(plantPrice)
        });

        console.log(`Inserted ${result.insertedCount} document into the collection.`);
        res.redirect('/');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});