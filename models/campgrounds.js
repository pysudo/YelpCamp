const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const campgroundsSchema = Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


campgroundsSchema.post('findOneAndDelete', async (doc) => {

    reviews = doc.review;
    await Review.deleteMany({
        _id: {
            $in: reviews
        }
    });
});


module.exports = mongoose.model('Campground', campgroundsSchema);