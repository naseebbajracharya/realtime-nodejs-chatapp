'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-facebook').Strategy;

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
    clientID: Secret.FacebookAppID,
    clientSecret: Secret.FacebookAppSecret,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'name', 'photos']
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    // console.log(profile.emails[0].value);

    User.findOne({facebook:profile.id}, (err, user) => {
        if(err){
           return done(err);
        }
        if(user){
            return done(null, user);
        }else{
            const newUser = {
            facebook : profile.id,
            fullname : profile.displayName,
            username : profile.displayName,
            email : profile.emails[0].value,
            userImage : `https://graph.facebook.com/${profile.id}/photos?size=large`
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
