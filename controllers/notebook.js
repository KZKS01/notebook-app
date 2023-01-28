//dependencies
const express = require('express');
const router = express.Router();
const data = require('../data');//seed data
const Note = require('../models/note');//the model object, constructor function is always capitalized

//SEED ROUTE
router.get('/notebook/seed', (req,res)=>{
    //reset database and recreate notes
    Notebook.deleteMany({}, (err, result)=>{//empty object will delete everything
    //result shows how many objects are deleted
    Notebook.create(data, (err, notebook)=>{
        res.redirect('/notebook');
    });

    });
});

//Index
router.get('/notebook', (req, res)=>{
    Note.find({}, (error, allNotes)=>{
        res.render('index.ejs', {
            Note: allNotes
        });
    });
});

module.exports = router;