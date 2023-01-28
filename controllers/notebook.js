//dependencies
const express = require('express');
const router = express.Router();
const data = require('../data');//seed data
const Note = require('../models/note');//the model object, constructor function is always capitalized

//SEED ROUTE
router.get('/notebook/seed', (req,res)=>{
    //reset database and recreate notes
    Note.deleteMany({}, (err, result)=>{//empty object will delete everything
    //result shows how many objects are deleted
    Note.create(data, (err, notebook)=>{
        console.log(err)
        console.log(notebook)
        res.redirect('/notebook');
    });

    });
});

//Index
router.get('/notebook', (req, res)=>{
    Note.find({}, (error, allNotes)=>{
        res.render('index.ejs', {
            notebook: allNotes
        });
    });
});

//New


//Delete


//Update
router.put('/notebook/:id', (req, res)=>{
    Note.findByIdAndUpdate(req.params.id, req.body, (err, note)=> {
        res.redirect('/notebook');
    });
});

//Create


//Edit
router.get('/notebook/:id/edit', (req, res)=>{
    Note.findById(req.params.id, (err, foundNote)=>{
        res.render('edit.ejs', {
            note: foundNote,
        });
    });
});

//Show
router.get('/notebook/:id', (req, res)=>{
    Note.findById(req.params.id, (err, foundNote)=>{
        // console.log(foundNote)
        res.render('show.ejs', {
            note: foundNote,
        });
    });
});


module.exports = router;