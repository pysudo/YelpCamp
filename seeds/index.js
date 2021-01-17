const mongoose = require('mongoose');

const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campgrounds');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // connected!
    console.log("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const newSample = new Campground({
            location: `${sample(cities).city}, ${sample(cities).state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await newSample.save()
    }
};

seedDB()
    .then(() => {
        mongoose.connection.close();
    })