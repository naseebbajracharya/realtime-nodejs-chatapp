'use strict';
const LoginHelp = require('../models/login-help');
const SignUpHelp = require('../models/signup-help');

module.exports = function(_, passport, UserValidation){
    return {
        SetRouting: function(router){
            //Get Route
            router.get('/', this.indexPage);
            router.get('/signup',this.getSignUp);
            router.get('/login/help', this.getLoginHelp);
            router.get('/signup/help', this.getSignupHelp);

            //Post Route
            router.post('/signup', UserValidation.SignUpValidation, this.postSignUp);
            router.post('/', UserValidation.LoginValidation, this.postLogin);
            router.post('/login-help', this.postLoginHelp);
            router.post('/signup-help', this.postSignUpHelp);
        },

        indexPage: function(req,res){
            const errors = req.flash('error')
            return res.render('index', {
                messages: errors,
                hasErrors: errors.length > 0
            });
        },

        getLoginHelp: (req,res) => {
            res.render('help/login-help');
        },

        postLoginHelp: (req,res)=> {
            const newLoginHelp = {
                email: req.body.email,
                requestedAt: new Date()
            }
            new LoginHelp(newLoginHelp).save((err) => {
                if(err){
                    throw err;
                } else {
                    res.redirect('/');
                }
            })
        },

        getSignupHelp: (req,res) => {
            res.render('help/signup-help');
        },

        postSignUpHelp: (req,res) => {
            const newSignUpHelp = {
                email: req.body.email,
                requestedAt: new Date()
            }
            new SignUpHelp(newSignUpHelp).save((err) => {
                if(err){
                    throw err;
                } else {
                    res.redirect('/');
                }
            })
        },

        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getSignUp: function(req,res){
            const errors = req.flash('error')
            return res.render('signup',{
                messages: errors,
                hasErrors: errors.length > 0
            });
        },

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        })
        
    }
}