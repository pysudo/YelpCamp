const Campground = require('../models/campground');
const Review = require('../models/review'); 


// Appends user review for a particular campground
module.exports.addReview = async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user;
    campground.review.push(review);
    await review.save();
    await campground.save();

    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}


// Delete a review from a campground
module.exports.deleteReview = async (req, res) => {

    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/campgrounds/${id}`);
}