const User = require('../models/user');


// Renders a form for users to register
module.exports.renderRegisterForm = (req, res) => {

    res.render('register')
}


// Registers the user to the database
module.exports.registerUser = async (req, res) => {

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
}


// Renders a form for users to sign in
module.exports.renderLoginForm = (req, res) => {

    res.render('login')
}


// Signs the user in
module.exports.loginUser = (req, res) => {

    // Redirects to previously requested URL after successfull authentication 
    // Else redirects to /campgrounds if original requested URL is the login page
    const redirectUrl = req.session.redirectUrl || '/campgrounds';
    req.session.redirectUrl = undefined;
    res.redirect(redirectUrl);
}


// Logs out user
module.exports.logoutUser = (req, res) => {

    req.logout();
    req.flash('success', 'Successfully logged out')
    res.redirect('/login');
}