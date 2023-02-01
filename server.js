// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const notesRouter = require('./controllers/notebook');
const usersRouter = require('./controllers/users'); //to use users.js
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
app.use(session({
    //configure middleware
    secret: process.env.SECRET, //allows server to digitally sign every session cookie for every user - a key to unlock session
    resave: false, //keep on reusing the data that is originally created
    saveUninitialized: false, //
})); //this need to be above routes

//custom middleware to inspect session store - for development purpose
// app.use((req, res, next)=>{
//     console.log(req.session);
//     next();//ensures that the lines below will run
// })

// authentication middleware
function isAuthenticated(req, res, next) {
    if(!req.session.userId){
        res.locals.user = null //if not login
        return res.redirect('/login')
    } else {
        res.locals.user = req.session.userId //req.session.userId is the current login user
    }; 
    next();//this makes sure that the code below will run
};

//mount routes
app.get('/', (req, res)=> res.render('home.ejs')); //home page route




app.use(usersRouter); //use line 5
//app.use(notesRouter); 
app.use(isAuthenticated, notesRouter); 

// Listener
app.listen(PORT, () => console.log(`server is listning on port: ${PORT}`))