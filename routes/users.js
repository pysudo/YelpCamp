const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();


// Renders a form for users to register
router.get('/register', (req, res) => {

    res.render('register')
});


// Registers the user to the database
router.post('/register', catchAsync(async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const user = await User.register({ username, email }, password);
        req.login(user, (err) => {
            if (err) return next(err);
            else {
                req.flash('success', 'Welcome to Yelp Camp!');
                res.redirect('/campgrounds');
            }
        });
    }
    catch (error) {
        req.flash('error', `${error.message}`);
        res.redirect('register')
    }
}));


// Renders a form for users to sign in
router.get('/login', (req, res) => {

    res.render('login')
});


// Signs the user in
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}),
    (req, res) => {

        // Redirects to previously requested URL after successfull authentication 
        // Else redirects to /campgrounds if original requested URL is the login page
        const redirectUrl = req.session.redirectUrl || '/campgrounds';
        req.session.redirectUrl = undefined;
        res.redirect(redirectUrl);
    });


// Logs out user
router.get('/logout', (req, res) => {
    
    req.logout();
    req.flash('success', 'Successfully logged out')
    res.redirect('/login');
})


module.exports = router;