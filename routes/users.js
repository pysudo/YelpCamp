const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

const users = require('../controllers/users');


const router = express.Router();


router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));


router.route('/login')
    .get(users.renderLoginForm)
    .post
    (
        passport.authenticate('local',
            {
                failureRedirect: '/login',
                failureFlash: true
            }
        ),
        users.loginUser
    );


router.get('/logout', users.logoutUser);


module.exports = router;