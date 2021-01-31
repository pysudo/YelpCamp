const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas');


// Validates sumbitted campground
module.exports.validateCampground = (req, res, next) => {

    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const errMsg = result.error.details.map(err => err.message);
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
}


// Validates user sumbitted reviews
module.exports.validateReview = (req, res, next) => {

    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const errMsg = result.error.details.map(err => err.message);
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
}


// Checks for user authentication before authorization
module.exports.checkAuthentication = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.flash('error', "You must be logged in to continue.");
        return res.redirect('/login');
    }
    else {
        next();
    }
}


// Checks for user access to specific campgrounds
module.exports.checkCampAuth = async (req, res, next) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permissions to do that.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


// Checks for user access to specific reviews
module.exports.checkReviewAuth = async (req, res, next) => {

    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permissions to do that.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}