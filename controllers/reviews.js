const campground = require('../models/campground');
const Review=require('../models/review');

module.exports.createReview=async (req,res)=>{
    const camp=await campground.findById(req.params.id);
     const newReview=new Review(req.body.review);
       newReview.author=req.user._id;
        camp.reviews.push(newReview);
       await newReview.save();
        await camp.save();
       res.redirect(`/campgrounds/${camp._id}`);
   }
module.exports.deleteReview=async(req,res)=>{
    const {id,reviewID}=req.params;
      await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
     await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);
    }