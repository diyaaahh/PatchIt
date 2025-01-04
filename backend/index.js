const express = require('express');
const connectToDatabase = require('./mongodb_connect');
const user = require('./Models/user')
const cors = require("cors")
const session = require("express-session");


const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(
    cors({
        origin: "http://localhost:5173", //frontend url
        credentials: true,
    })
    );
    
    app.use(session({
        secret: 'your-secret-key', // Replace with a strong secret
        resave: false,
        saveUninitialized: true,
    }));

let db;

// Initialize the database connection
(async () => {
    try {
        db = await connectToDatabase();
        console.log('MongoDB connected succesfully!')
    } catch (error) {
        console.error("Failed to initialize MongoDB connection:", error);
    }
})();

const userRoutes= require('./Routes/userRoute')
const photoRoutes=require('./Routes/photoRoute')

app.use("/user", userRoutes)
app.use("/photo", photoRoutes)


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
