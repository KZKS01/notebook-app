//dependencies
const express = require('express');
const router = express.Router();
const data = require('../data');//seed data
const Note = require('../models/note');//the model object, constructor function is always capitalized
const user = require('../models/user');
const cloudinary = require('cloudinary').v2;//request cloudinary library
const mongoose = require('mongoose');

//SEED ROUTE
router.get('/notebook/seed', (req,res)=>{
    //reset database and recreate notes
    Note.deleteMany({}, (err, result)=>{//empty object will delete everything
    //result shows how many objects are deleted
});
    Note.create(data, (err, notebook)=>{
        console.log(err)
        console.log(notebook)
        res.redirect('/notebook');
    });

    });

//Index
router.get('/notebook', (req, res)=>{
    //finds all the notes in the database that have a "createdBy" field=the value stored in req.session.userId
    Note.find({createdBy: req.session.userId}, (error, allNotes)=>{
        res.render('index.ejs', {
            notebook: allNotes
        });
    });
});

//New
router.get('/notebook/new', (req, res)=>{
    user.find({}, (err, users)=>{
        if(err) {
            console.log(err);
        } else {
            res.render('new.ejs', {users: users});
        }
    })
});

//Delete
router.delete('/notebook/:id', (req, res)=>{
    Note.findByIdAndDelete(req.params.id, (err, deletedNote)=>{
        res.redirect('/notebook');
    })
})

//Update
router.put('/notebook/:id', (req, res)=>{
    Note.findByIdAndUpdate(req.params.id, req.body, (err, note)=> {
        res.redirect('/notebook');
    });
});

//Create
router.post('/notebook/:id', (req, res)=>{
    console.log(req.files);
    //use req.files object(contains all uploaded files) to retrieve a file from a multipart/form-data request. 
    if(req.files) {
    const photo = req.files.photo;
    //The property photos is used to retrieve the file with the key "photos" from the req.files object. The retrieved file will be stored in the photos variable.
    photo.mv(`./uploads/${photo.name}`);//mv is a fn to move the file elsewhere on the server
    //upload our file to cloudinary, cloudinary will give us a url for that file
    cloudinary.uploader.upload(`./uploads/${photo.name}`, (err, result)=>{ 
        console.log(err, result);
        req.body.photo = result.secure_url;//secure_url can be found from result
    });
};
    Note.create(req.body, (err, createdNote)=>{
        console.log(err);
        res.redirect('/notebook');
    });
});

//Edit
router.get('/notebook/:id/edit', (req, res)=>{
    Note.findById(req.params.id, (err, foundNote)=>{
        res.render('edit.ejs', {
            note: foundNote,
        });
    });
});

//Show
router.get('/notebook/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).send('Invalid note ID.');
    }

    const foundNote = await Note.findById(noteId).populate('createdBy').exec();
    if (!foundNote) {
      return res.status(404).send('Note not found.');
    }
    res.render('show.ejs', {
      note: foundNote
    });
  } catch (err) {
    console.log(err);
  }
});



module.exports = router;