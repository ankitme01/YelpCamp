const campground = require('../models/campground');
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
  
    const newCampground = new campground(req.body.campground);
    newCampground.author=req.user._id;
    await newCampground.save();
    req.flash('success', 'new campground was added successfully');
    res.redirect(`/campgrounds/${newCampground._id}`);
  };