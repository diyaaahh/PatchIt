const express = require('express');
const { MongoClient } = require('mongodb');



// MongoDB connection string
const uri = "mongodb+srv://diya:<password>@cluster0.ly4mh.mongodb.net/";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");
        return client.db("myDatabase"); // Replace "myDatabase" with your database name
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
        throw error;
    }
}


module.exports = connectToDatabase;