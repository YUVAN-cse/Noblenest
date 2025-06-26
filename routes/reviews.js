const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsnc = require("../utils/wrapAsnc.js")
const { isLoggedIn ,isAuthor,validateReview} = require("../middleware.js")
const listingController = require("../controllers/review.js")

router.post("/", validateReview, isLoggedIn, wrapAsnc(listingController.createReview))

router.delete("/:review_id",isLoggedIn,isAuthor,wrapAsnc(listingController.destroyReview))


module.exports = router