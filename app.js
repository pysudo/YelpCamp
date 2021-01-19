const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');

const Campground = require('./models/campgrounds');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema } = require('./schemas');


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


const validateCampground = (req, res, next) => {

    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const errMsg = result.error.details.map(err => err.message);
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
}

// Home page
app.get('/', (req, res) => {

    res.render('home');
});


// Diplays the list of campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {

    const campgrounds = await Campground.find({});

    res.render('campgrounds/index', { campgrounds });
}));


// Renders form to append new campgrounds
app.get('/campgrounds/new', (req, res) => {

    res.render('campgrounds/new');
});


// Append new campgrounds
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {

    const campground = new Campground(req.body.campground);
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
}));


// Shows specific detail about a campgrounds
app.get('/campgrounds/:id', catchAsync(async (req, res) => {

    const campground = await Campground.findById(req.params.id);

    res.render('campgrounds/show', { campground });
}));


// Renders form to edit campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {

    const campground = await Campground.findById(req.params.id);

    res.render('campgrounds/edit', { campground });
}));


// Edits and updates existing campground
app.put('/campgrounds/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    const editedCampground = req.body.campground;
    const updatedCampground = await Campground.findByIdAndUpdate(id, editedCampground, { new: true });

    res.redirect(`/campgrounds/${updatedCampground._id}`);
}));

// Deletes existing campground 
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {

    await Campground.findByIdAndDelete(req.params.id);

    res.redirect('/campgrounds');
}));


app.all('*', (req, res, next) => {

    next(new ExpressError("Page Not Found", 404));
});


app.use((err, req, res, next) => {

    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode).render('error', { err });
});


// Starts up localhost
app.listen(3000, () => {

    console.log("Serving on port 3000.");
});