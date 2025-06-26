const express = require("express")
const router = express.Router()
const wrapAsnc = require("../utils/wrapAsnc.js")
const {isLoggedIn,isOwner,validateError} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage })

router.get("/new", isLoggedIn,listingController.newList)

router.post("/search",listingController.search)
router.route("/:id")
      .get(wrapAsnc(listingController.show))
      .patch( isLoggedIn,isOwner,upload.single('image'),validateError,wrapAsnc(listingController.update))
      .delete(isLoggedIn, isOwner,wrapAsnc(listingController.destroy))

router.route("/")
      .get(wrapAsnc(listingController.index))
      .post(isLoggedIn,upload.single('image'),validateError, wrapAsnc(listingController.newListPost))


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsnc(listingController.edit))

module.exports = router