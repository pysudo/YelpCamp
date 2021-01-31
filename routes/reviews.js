const express = require('express');

const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {
    validateReview,
    checkAuthentication,
    checkReviewAuth
} = require('../utils/middlewares')


const router = express.Router({ mergeParams: true });


// Appends user review for a particular campground
router.post('/', checkAuthentication, validateReview, catchAsync(async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user;
    campground.review.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!');

    res.redirect(`/campgrounds/${campground._id}`);
}));


// Delete a review from a campground
router.delete('/:reviewId', checkAuthentication, checkReviewAuth, catchAsync(async (req, res) => {

    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');

    res.redirect(`/campgrounds/${id}`);

}));


// Exports the routes for reviews specific paths to app.js 
module.exports = router;