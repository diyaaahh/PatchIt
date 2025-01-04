const express = require('express');
const mongoose = require('mongoose')
const { MongoClient } = require('mongodb');



// MongoDB connection string
const uri = "mongodb+srv://diya:diya@cluster0.ly4mh.mongodb.net/";



async function connectToDatabase() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB Atlas using Mongoose!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}


module.exports = connectToDatabase;