const express = require('express');

const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { checkAuthentication } = require('../utils/checkAuthentication')


const router = express.Router();


// Validates sumbitted campground
const validateCampground = (req, res, next) => {

    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const errMsg = result.error.details.map(err => err.message);
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
}


// Diplays the list of campgrounds
router.get('/', catchAsync(async (req, res) => {

    const campgrounds = await Campground.find({});

    res.render('campgrounds/index', { campgrounds });
}));


// Renders form to append new campgrounds
router.get('/new', checkAuthentication, (req, res) => {

    res.render('campgrounds/new');
});


// Append new campgrounds
router.post('/', checkAuthentication, validateCampground, catchAsync(async (req, res) => {

    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a campground!');

    res.redirect(`/campgrounds/${campground._id}`);
}));


// Shows specific detail about a campgrounds
router.get('/:id', catchAsync(async (req, res) => {

    const campground = await Campground.findById(req.params.id).populate('review');
    if (!campground) {
        req.flash('error', 'The campground was not found!');
        return res.redirect(`/campgrounds`);
    }

    res.render('campgrounds/show', { campground });
}));


// Renders form to edit campground
router.get('/:id/edit', checkAuthentication, catchAsync(async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'The campground was not found!');
        return res.redirect(`/campgrounds`);
    }

    res.render('campgrounds/edit', { campground });
}));


// Edits and updates existing campground
router.put('/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    const editedCampground = req.body.campground;
    const updatedCampground = await Campground.findByIdAndUpdate(id, editedCampground, { new: true });
    req.flash('success', 'Successfully updated the campground!');


    res.redirect(`/campgrounds/${updatedCampground._id}`);
}));


// Deletes existing campground 
router.delete('/:id', catchAsync(async (req, res) => {

    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the campground!');


    res.redirect('/campgrounds');
}));


// Exports the routes for campgrounds specific paths to app.js 
module.exports = router;