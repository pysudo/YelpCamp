const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const path = require('path');

const Campground = require('./models/campgrounds');
const { nextTick } = require('process');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // connected!
    console.log("Database connected")
});

app = express();

app.engine('ejs', ejsMate);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    
    res.render('home');
})


app.get('/campgrounds', async (req, res) => {

    const campgrounds = await Campground.find({});
    
    res.render('campgrounds/index', { campgrounds });
})


app.post('/campgrounds', async (req, res) => {

    const campground = new Campground(req.body.campground);
    await campground.save();
    
    res.redirect(`/campgrounds/${campground._id}`);
})


app.get('/campgrounds/new', (req, res) => {

    res.render('campgrounds/new');
})


app.get('/campgrounds/:id', async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    
    res.render('campgrounds/show', { campground });
})


app.get('/campgrounds/:id/edit', async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    
    res.render('campgrounds/edit', { campground });
})


app.put('/campgrounds/:id', async (req, res) => {

    const { id } = req.params;
    const editedCampground = req.body.campground;
    const updatedCampground = await Campground.findByIdAndUpdate(id, editedCampground, { new: true });
    
    res.redirect(`/campgrounds/${updatedCampground._id}`);
})


app.delete('/campgrounds/:id', async (req, res) => {

    await Campground.findByIdAndDelete(req.params.id);
    
    res.redirect('/campgrounds');
})


app.use((req, res) => {

    res.status(404).send("404 NOT FOUND :(");
})


app.listen(3000, () => {

    console.log("Serving on port 3000.");
})