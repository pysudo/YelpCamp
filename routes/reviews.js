const express = require('express');

const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


const router = express.Router({ mergeParams: true });


// Validates user sumbitted reviews
const validateReview = (req, res, next) => {

    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const errMsg = result.error.details.map(err => err.message);
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
}


// Appends user review for a particular campground
router.post('/', validateReview, catchAsync(async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.review.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!');

    res.redirect(`/campgrounds/${campground._id}`);
}));


// Delete a review from a campground
router.delete('/:reviewId', catchAsync(async (req, res) => {

    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');

    res.redirect(`/campgrounds/${id}`);

}));


// Exports the routes for reviews specific paths to app.js 
module.exports = router;