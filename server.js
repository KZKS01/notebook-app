// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const notesRouter = require('./controllers/notebook');
const usersRouter = require('./controllers/users'); //to use users.js
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;//request cloudinary library

//initialize the application
const app = express();

//configure settings
require('dotenv').config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET  
  });

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
app.use(session({
    //configure middleware
    secret: process.env.SECRET, //allows server to digitally sign every session cookie for every user - a key to unlock session
    resave: false, //keep on reusing the data that is originally created
    saveUninitialized: false, //
})); //this need to be above routes
app.use(fileUpload({ createParentPath: true }));

// authentication middleware
function isAuthenticated(req, res, next) {
    if(!req.session.userId){
        res.locals.user = null //if not login
        return res.redirect('/login')
    } else {
        res.locals.user = req.session.userId //req.session.userId is the current login user
    }; 
    next();//ensures the code below will run
};

//mount routes
app.get('/', (req, res)=> res.render('home.ejs')); //home page route

app.use(usersRouter); //use line 5
//app.use(notesRouter); 
app.use(isAuthenticated, notesRouter); 

// Listener
app.listen(PORT, () => console.log(`server is listning on port: ${PORT}`))