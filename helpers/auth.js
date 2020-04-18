module.exports = {
    requireLogin: (req,res,next) => {
        if(req.isAuthenticated()){ //if user is logged in callback function will be fired
            return next();
        }else{
            res.redirect('/');
        }
    },
    ensureGuest: (req,res,next) => {
        if(req.isAuthenticated()){
            res.redirect('/home');
        }else{
            return next();
        }
    }
}