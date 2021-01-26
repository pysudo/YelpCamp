const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');

const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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