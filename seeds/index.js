const mongoose = require('mongoose');

const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');


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
            author: '6016da1d9ee66e5511d6a91f',
            geometry : { "type" : "Point", "coordinates" : [ -99.000178, 19.235793 ] },
            location: `${sample(cities).city}, ${sample(cities).state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images:[
                {
                    url: "https://res.cloudinary.com/bearsterns/image/upload/v1612386114/YelpCamp/j9rzdozfxydzjggr15qt.jpg",
                    filename: "YelpCamp/j9rzdozfxydzjggr15qt" 
                },
                {
                    url: "https://res.cloudinary.com/bearsterns/image/upload/v1612386115/YelpCamp/f73rgi7clegmb3sfr2ni.jpg",
                    filename: "YelpCamp/f73rgi7clegmb3sfr2ni" 
                },
                {
                    url: "https://res.cloudinary.com/bearsterns/image/upload/v1612386116/YelpCamp/mvlrvlkazsvzfj32ezsy.jpg",
                    filename: "YelpCamp/mvlrvlkazsvzfj32ezsy" 
                }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio sint nisi ad doloribus! Tempore pariatur possimus quibusdam quaerat optio eius voluptatibus voluptatem quod. Cum vel quidem omnis architecto laudantium explicabo!',
            price: `${Math.floor(Math.random() * 20) + 10}`
        });
        await newSample.save()
    }
};

seedDB()
    .then(() => {
        mongoose.connection.close();
    })