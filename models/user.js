const mongoose = require('mongoose');
const Schema = mongoose.Schema; //shortcus var

const userSchema = new Schema({
    email: {
        type: String,
        required: true, 
        unique: true, //one email one user
        lowercase: true //normalize the email address to lowercase, then store in database to ensure one email one user 
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);