if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
var methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
var flash = require('connect-flash');
const listings = require("./routes/listings.js")
const userRouter = require("./routes/users.js")
const reviews = require("./routes/reviews.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const multer  = require('multer')



main()
  .then(() => { console.log("connected") })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);


const store = MongoStore.create({
  mongoUrl:process.env.ATLASDB_URL,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*60*60,
})


const sessionoptions = {
  store,
 secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*100,
    maxAge:7*24*60*60*100,
    httpOnly:true
  }
}

app.use(session(sessionoptions))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next()
})

app.get("/demoUser" , async(req,res)=>{
  let fakeUser = new User({
    email: "Yuvan@gmail.com",
    username: "YUVAN-great",
  })
  let fakeuser = await User.register(fakeUser,"helloworld")
  res.send(fakeuser)

})


app.get("/", (req, res) => {
  res.send("working")
  console.log(req.session)
})



app.use("/listings" , listings)
app.use("/" , userRouter)
app.use("/listings/:id/reviews" , reviews)


app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
  // res.send("something went wrong")
  let { statuscode = 500, message } = err
  // res.status(statuscode).send(message)
  res.render("error.ejs",{message})
})

app.listen(8080, () => {
  console.log("listening")
})