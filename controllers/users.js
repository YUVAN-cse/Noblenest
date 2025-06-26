
const User = require("../models/user")


module.exports.signup = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signupPost = async(req,res)=>{
   try {
     const {username, email , password} = req.body
    const registeredUser =new User( {
        username:username,
        email:email,
    })
    let registed = await User.register(registeredUser,password)
    console.log(registed)

    req.login(registed,(err)=>{
        if(err) return next(err)
            req.flash("success" , "signned in")
            res.redirect("/listings")
    })
   } catch (error) {
    req.flash("error",error.message)
    // console.log(error[UserExistsError])
    // res.send(error.message)
    res.redirect("/signup")
   }
}

module.exports.login = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.loginPost = async(req,res)=>{
    req.flash("success" , "Logged in successfully")
    // console.log( res.locals.redirectUrl)
    let rediredt = res.locals.redirectUrl || "/listings"
    console.log(rediredt)
    console.log("rediredt")
    res.redirect(rediredt)
}

module.exports.logout =  (req, res) => {
    req.logOut((err) => {
        if (err) {
            req.flash("error", "Error occured during logout")
            res.redirect("/listings")
            return
        }
        req.flash("success", "Logged out successfully")
        res.redirect("/listings")

    })
}