const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');


const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });


// Diplays the list of campgrounds
module.exports.listCampgrounds = async (req, res) => {

    const campgrounds = await Campground.find({});

    res.render('campgrounds/index', { campgrounds });
}


// Renders form to append new campgrounds
module.exports.renderNewForm = (req, res) => {

    console.log(req.query)

    res.render('campgrounds/new');
}


// Append new campgrounds
module.exports.createCampground = async (req, res) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.author = req.user;
    await campground.save();
    console.log(campground)

    req.flash('success', 'Successfully created a campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}


// Shows specific detail about a campgrounds
module.exports.showCampground = async (req, res) => {

    const campground = await Campground.findById(req.params.id)
        .populate
        (
            {
                path: 'review',
                populate: {
                    path: 'author'
                }
            }
        )
        .populate('author');

    if (!campground) {

        req.flash('error', 'The campground was not found!');
        return res.redirect(`/campgrounds`);
    }

    res.render('campgrounds/show', { campground });
}


// Renders form to edit campground
module.exports.renderEditForm = async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    if (!campground) {

        req.flash('error', 'The campground was not found!');
        return res.redirect(`/campgrounds`);
    }

    res.render('campgrounds/edit', { campground });
}


// Edits and updates existing campground
module.exports.editCampground = async (req, res) => {

    const { id } = req.params;
    const editedCampground = req.body.campground;
    const updatedCampground = await Campground.findByIdAndUpdate
        (
            id,
            editedCampground,
        );
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    updatedCampground.images.push(...images);
    await updatedCampground.save();

    // After deleting URL reference from mongo, procceed to delete in cloudinary  
    if (req.body.deleteImages) {

        await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
    }

    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
}


// Deletes existing campground 
module.exports.deleteCampground = async (req, res) => {

    await Campground.findByIdAndDelete(req.params.id);

    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}

