module.exports.checkAuthentication = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.flash('error', "You must be logged in to continue.");
        return res.redirect('/login');
    }
    else {
        next();
    }
}