const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const User = require('./models/user');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // connected!
    console.log("Database connected");
});


app = express();


app.engine('ejs', ejsMate);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'asdasdasdasd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
   
    // Deals with redirects after successfull login to previously requested URL
    // This occurs if the user tries to access resource unauthenticated. 
    if(!['/login', '/'].includes(req.originalUrl)) {
        req.session.redirectUrl = req.originalUrl;
    }

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    
    next();
});

// Routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);



// Home page
app.get('/', (req, res) => {

    res.render('home');
});


// Displays a 404, if requested page is invalid 
app.all('*', (req, res, next) => {

    next(new ExpressError("Page Not Found", 404));
});


// Error checking middleware
app.use((err, req, res, next) => {

    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode).render('error', { err });
});


// Starts up localhost
app.listen(3000, () => {

    console.log("Serving on port 3000.");
});

