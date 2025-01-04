const express = require('express');
const connectToDatabase = require('./mongodb_connect');
const user = require('./Models/user')
const multer = require('multer');
const cors = require("cors")
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('assets'));

app.use(
    session({
        secret: "dsakdbdbaszj",
        resave: false,
        saveUninitialized: true, // Add this line to ensure uninitialized sessions are saved
        cookie: {
            secure: false, 
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'Lax',
        },
    })
);


app.use(
    cors({
      origin: "http://localhost:5173", //frontend url
     
      credentials: true,
    })
  );


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
const photoRoutes= require('./Routes/photoRoute')

app.use("/user", userRoutes)
app.use("/photo", photoRoutes)


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
