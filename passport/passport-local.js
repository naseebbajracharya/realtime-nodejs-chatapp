'use strict';
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//Sign Up Process
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
}, (req, email, password, done) => {
    User.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, false, req.flash('error', 'User already exists!'));
        }
        //else
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            done(null, newUser);
        })
    })
}));


//Login Process
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
}, (req, email, password, done) => {
    User.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }

        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('Email / Password doesnot match');
            return done(null, false, req.flash('error', messages));
        }
       
        return done(null,user);
    })
}));