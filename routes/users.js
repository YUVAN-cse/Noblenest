const express = require("express")
const router = express.Router()
const passport = require("passport")
const { redirectUrl } = require("../middleware.js")
const listingController = require("../controllers/users.js")


router.route("/signup")
    .get(listingController.signup)
    .post(listingController.signupPost)

router.route("/login")
    .get(listingController.login)
    .post(redirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), listingController.loginPost)



router.get("/logout", listingController.logout)

module.exports = router