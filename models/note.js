//defines a Mongoose schema for a "note" object
//imports Mongoose library
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creates a new schema object, an instance of 'Schema' class
const noteSchema = new Schema({
    //defines properties of the Note object
    title: {type: String, required: true},
    author: {type: String, required: true},
    date: {type: Date, required: true},
    content: {type: String, required: false},
});

//exports Mongoose model 'note', which is based on the noteSchema, so that it can be used in other parts of the app to interact with 'Note' in MongoDB database
//exports the 'noteSchema' by adding it as a model to the mongoose object and names it 'Note'
module.exports = mongoose.model('Note', noteSchema);

