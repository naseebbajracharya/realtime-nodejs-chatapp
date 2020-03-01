'use strict';

module.exports = function(_, passport, UserValidation){
    return {
        SetRouting: function(router){
            //Get Route
            router.get('/', this.indexPage);
            router.get('/signup',this.getSignUp);
            router.get('/login/help', this.getLoginHelp);

            //Post Route
            router.post('/signup', UserValidation.SignUpValidation, this.postSignUp);
            router.post('/', UserValidation.LoginValidation, this.postLogin);
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