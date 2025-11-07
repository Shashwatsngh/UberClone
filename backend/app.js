const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
 

// User Routes 
const userRoutes = require('./routes/user.routes');
app.use('/users', userRoutes);
 
const connectDB = require('./db/db');
connectDB();

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Uber Clone API');
});

 

module.exports = app;