'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user');
const Secret = require('../secret/secret');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
       return done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: Secret.GoogleClientID,
    clientSecret: Secret.GoogleClientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    // console.log(profile.emails[0].value);

    User.findOne({google:profile.id}, (err, user) => {
        if(err){
           return done(err);
        }
        if(user){
            return done(null, user);
        }else{
            const newUser = {
            google : profile.id,
            fullname : profile.displayName,
            username : profile.displayName,
            email : profile.emails[0].value,
            userImage : profile.photos[0].value
            }
            new User(newUser).save((err) => {
                if(err){
                    return done(err)
                }
                return done(null, newUser);
            });
        }
    });
    
}));
