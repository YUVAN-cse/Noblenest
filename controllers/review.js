const List = require("../models/listing")
const Review = require("../models/review")

module.exports.createReview = async (req, res) => {
  let { id } = req.params
  // console.log(id) 
  console.log(req.body.review)
  let listing = await List.findById(id)
  let newReview = new Review(req.body.review)
  console.log(newReview)
  newReview.author = req.user._id
  listing.reviews.push(newReview)

  await newReview.save()
  await listing.save()
  req.flash("success", "New review added sucessfully")
  console.log(listing)
  console.log(newReview)
  res.redirect(`/listings/${id}`)
}

module.exports.destroyReview =  async (req, res) => {
  let { id, review_id } = req.params
  console.log(id)
  console.log(review_id)
  await List.findByIdAndUpdate(id, { $pull: { reviews: review_id } })
  await Review.findByIdAndDelete(review_id)
  req.flash("success", "Review deleted sucessfully")
  res.redirect(`/listings/${id}`)
}