const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

//sign up users
//provides sign up form
router.get('/signup', (req, res)=>{
    res.render('signup.ejs');
});
//hdnale form submission
router.post('/signup', (req, res)=>{
    const hashedPassword = bcrypt.hashSync(req.body.password, 10); //data, salt rounds
    req.body.password = hashedPassword;
    User.create(req.body, (err, newUser)=>{
        req.session.userId = newUser._id; //new user will be logged in when signed up
        res.redirect('/notebook')
    })
})

//login users
//provides login form
router.get('/login', (req, res)=>{
    res.render('login.ejs');
});
//handle form submission
router.post('/login', (req, res)=>{
    //1) look up user using the email
    User.findOne({email: req.body.email}, (err, foundUser)=>{
        //if not exists, redirect login page
        if(!foundUser) {
            return res.redirect('/login');
        }
        //if exists, compare password
        const isMatched = bcrypt.compareSync(req.body.password, foundUser.password);
             //2) user exists, use bcrypt to compare provided plain text
                //if the password does NOT match, we redirect login page
                if(!isMatched){
                    return res.redirect('/login');
                }
                req.session.userId = foundUser._id;//create a session for user
                //if password matches
                res.redirect('/notebook');  
    });
});
//logout users
router.get('/logout', (req, res) =>{
    req.session.destroy((err)=>{
        res.redirect('/login');
    })
})

module.exports = router;