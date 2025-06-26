const Listing = require("./models/listing")
const Review = require("./models/review")
const { listingSchema } = require("./schema")
const { reviewSchema } = require("./schema.js")

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.session.redirectUrl = req.originalUrl
  req.flash("error", "Login is Must")
  res.redirect("/login")
}


module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params
  const list = await Listing.findById(id)
  if (!(res.locals.currUser && list.owner.equals(res.locals.currUser._id))) {
    req.flash("error", "You are not the owner of the listings")
    res.redirect("/listings")
    return
  }

  next()
}


module.exports.isAuthor = async (req, res, next) => {
  let { review_id } = req.params
  const review = await Review.findById(review_id)
  if(res.locals.currUser && review.author.equals(res.locals.currUser._id)){
    return next()
  }
  req.flash("error" , "You are not the owner of the review")
  res.redirect("/listings")
}

module.exports.validateError = (req, res, next) => {
  const { error } = listingSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  }
  else {
    next()
  }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  }
  else {
    next()
  }
}

module.exports.redirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next()
}


