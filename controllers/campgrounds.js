const campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index=async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });
  }
  module.exports.renderEditForm=async (req, res) => {
    const camp = await campground.findById(req.params.id);
    if(!camp)
    {
      req.flash('error','campground not found');
      res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { camp });
  }
  module.exports.updateCampground=async (req, res) => {
    const camp = await campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    const img=req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...img);
    await camp.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
          await cloudinary.uploader.destroy(filename);
      }
      await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
    req.flash('success', 'campground was successfully updated');
    res.redirect(`/campgrounds/${camp._id}`);
  
  }
  module.exports.deleteCampground=async (req, res) => {
    const camp = await campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'campground successfully delete');
    res.redirect('/campgrounds');
  }
  module.exports.renderNewForm=(req, res) => {
    res.render('campgrounds/new');
  };
  module.exports.showCampground=async (req, res) => {
    const camp = await campground.findById(req.params.id).populate(
    {  path:'reviews',
        populate:
          {
            path:'author'
          }
      }).populate('author');
    if(!camp)
    {
      req.flash('error','campground not found');
      res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/show', {camp});
  };
  module.exports.createCampground=async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1
  }).send()
    const newCampground = new campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.author=req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'new campground was added successfully');
    res.redirect(`/campgrounds/${newCampground._id}`);
  };