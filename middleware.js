const {campgroundSchema,reviewSchema}=require('./schemas');
const expressError=require('./utils/expressError');
const campground=require('./models/campground');
const Review=require('./models/review');
module.exports.isLoggedIn=(req,res,next)=>{

if(!req.isAuthenticated())
{
  req.session.returnTo=req.originalUrl;
  req.flash('error','not logged in');
  return res.redirect('/login');
}
next();
}
module.exports.validateCampground=(req,res,next)=>{
  const {error}=campgroundSchema.validate(req.body);
  if(error)
  {
    const msg=error.details.map(el=>el.message).join(",");
    throw new expressError(msg,400);
  }
  else
  {
    next();
  }
}
module.exports.isAuthor=async (req,res,next)=>{
  const {id}=req.params;
const camp= await campground.findById(id);
if(!camp.author.equals(req.user._id))
{
  req.flash('error','you are not authorised to do that');
  return res.redirect(`/campgrounds/${id}`);
}
next();
}
module.exports.validateReview=(req,res,next)=>{
  const {error}=reviewSchema.validate(req.body);
  if(error)
  {
    const msg=error.details.map(el=>el.message).join(",");
    throw new expressError(msg,400);
  }
  else
  {
    next();
  }
}
module.exports.isReviewAuthor=async (req,res,next)=>{
  const {id,reviewID}=req.params;
const review= await Review.findById(reviewID);
if(!review.author.equals(req.user._id))
{
  req.flash('error','you are not authorised to do that');
  return res.redirect(`/campgrounds/${id}`);
}
next();
}