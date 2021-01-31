const express = require('express');

const catchAsync = require('../utils/catchAsync');
const {
    validateReview,
    checkAuthentication,
    checkReviewAuth
} = require('../utils/middlewares')
const reviews = require('../controllers/reviews');


const router = express.Router({ mergeParams: true });


// Appends user review for a particular campground
router.post
    (
        '/',
        checkAuthentication,
        validateReview,
        catchAsync(reviews.addReview)
    );


// Delete a review from a campground
router.delete
    (
        '/:reviewId',
        checkAuthentication,
        checkReviewAuth,
        catchAsync(reviews.deleteReview)
    );


// Exports the routes for reviews specific paths to app.js 
module.exports = router;