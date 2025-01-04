const express = require('express');
const connectToDatabase = require('./mongodb_connect');

const app = express();
const port = 3000;

let db;

// Initialize the database connection
(async () => {
    try {
        db = await connectToDatabase();
    } catch (error) {
        console.error("Failed to initialize MongoDB connection:", error);
    }
})();

// Test connectivity route
app.get('/test-connection', async (req, res) => {
    if (!db) {
        return res.status(500).send("Database connection not established.");
    }
    try {
        const collection = db.collection("myCollection"); // Replace "myCollection" with your collection name

        // Example: Test inserting a document
        await collection.insertOne({ test: "Connectivity Test", timestamp: new Date() });

        res.status(200).send("Connected to MongoDB Atlas successfully!");
    } catch (error) {
        console.error("Error during connectivity test:", error);
        res.status(500).send("Failed to connect to MongoDB Atlas.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
