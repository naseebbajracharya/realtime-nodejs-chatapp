'use strict';
//User Validations
module.exports = function(){
    return {
        SignUpValidation: (req,res,next) => {
            //Sign up Field Validations
            req.checkBody('username', 'Username is required*').notEmpty();
            req.checkBody('username', 'Username should contain atleast 5 characters!').isLength({min: 5});
            req.checkBody('email', 'Email is required*').notEmpty();
            req.checkBody('email', 'Entered email is invalid!').isEmail();
            req.checkBody('password', 'Password is required*').notEmpty();
            req.checkBody('password', 'Password should contain atleast 5 characters!').isLength({min: 5});

            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                    //Pushing Error messages
                    req.flash('error', messages);
                    res.redirect('/signup');
                }).catch((err) => {
                    return next();
                })
        },


        LoginValidation: (req,res,next) => {
            //Login Validations
            req.checkBody('email', 'Email is required*').notEmpty();
            req.checkBody('email', 'Entered email is invalid!').isEmail();
            req.checkBody('password', 'Password is required*').notEmpty();
            req.checkBody('password', 'Password should contain atleast 5 characters!').isLength({min: 5});

            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                    //Pushing Error messages
                    req.flash('error', messages);
                    res.redirect('/');
                }).catch((err) => {
                    return next();
                })
        }
    }
}