const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware');
const campgrounds=require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
       .get(catchAsync(campgrounds.index))
       .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground));
  
     router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));
router.get('/new',isLoggedIn,campgrounds.renderNewForm);
router.route('/:id')
     .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync( campgrounds.updateCampground))
     .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))
     .get(catchAsync(campgrounds.showCampground));


  module.exports= router;