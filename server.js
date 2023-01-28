// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const notesRouter =require('./controllers/notebook');
const methodOverride = require('method-override');


//initialize the application
const app = express();

//configure settings
require('dotenv').config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;


//establish connection to mongodb
mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URL);
//Database Connection Error/Success
//Define callback functions for various events
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is mongo not running?')); //"error" is the name of the event
db.on('connected', () => console.log('mongo connected'));


//mount middleware
app.use(express.urlencoded({extended: false}))
app.use(express.static('public')); 
app.use(methodOverride('_method'));
//mount routes
app.use(notesRouter);


// Listener
app.listen(PORT, () => console.log(`server is listning on port: ${PORT}`))