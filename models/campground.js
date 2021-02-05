const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const imagesSchema = Schema({

    url: String,
    filename: String
})


const campgroundsSchema = Schema({

    title: String,
    images: [imagesSchema],
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: {
        type: String,
        required: true
    },
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


imagesSchema.virtual('thumbnail').get(function() {
    return this.url.replace('upload/', 'upload/w_200/');
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