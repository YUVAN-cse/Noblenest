const List = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allList = await List.find()
  res.render("listings/index.ejs", { allList })
}

module.exports.newList = (req, res) => {
  res.render("listings/new.ejs")
}

module.exports.newListPost = async (req, res, next) => {
  const result = await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
  })
    .send()
    let url = req.file.path;
    let filename = req.file.filename;
    let { title, description, image, price, location, country } = req.body
    owner = req.user._id
    geometry = result.body.features[0].geometry
  const savedOne = await List.insertOne({
    title: title,
    description: description,
    image: image,
    price: price,
    location: location,
    country: country,
    owner: owner,
    image: { url, filename },
    geometry: geometry,
  })
  req.flash("success", "Listing added")
  res.redirect(`/listings`)
}


// module.exports.search = async(req,res)=>{
//       // console.log(req.body.searchQuery)
//       const info = req.body.searchQuery;
//       if(info){
//         const list = await List.findOne({title: info})
//         console.log(list)
//         res.redirect(`/listings/${list._id}`)
//       }
//       else{
//         req.flash("error","Invalid title")
//         res.redirect("/listings")
//       }
// }


module.exports.search = async(req,res)=>{

  const country = req.body.searchQuery;
  const listing = await List.find({country:country})
  // console.log(listing)
  if(listing && listing.length){
    res.render("listings/country.ejs",{listing,country})
  }
  else{
    req.flash("error" , "country listing doesn't exist")
    res.redirect("/listings")
  }
}

module.exports.show = async (req, res) => {
  let { id } = req.params;
  let list = await List.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!list) {
    req.flash("error", "This listing doesn't exist")
    return res.redirect("/listings")
  }
  res.render("listings/list.ejs", { list })
}

module.exports.edit = async (req, res) => {
  let { id } = req.params
  let data = await List.findById(id)
  if (!data) {
    req.flash("error", "This listing doesn't exist")
    return res.redirect("/listings")
  }
  let previewImg = data.image.url.replace("/upload", "/upload/h_200,w_250")
  res.render("listings/edit.ejs", { data, previewImg })

}

module.exports.update = async (req, res) => {
  const result = await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
  })
    .send()
  let { id } = req.params
  let { title, description, price, location, country } = req.body
  let image;
  geometry = result.body.features[0].geometry
  if (req.file) {
    req.file.url = req.file.path;
    let { url, filename } = req.file
    image = { url, filename }
  }
  let obj = {
    title,
    description,
    image,
    price,
    location,
    country,
    geometry
  };
  req.flash("success", "Listing editted sucessfully")
  await List.findByIdAndUpdate(id, obj)

  res.redirect(`/listings/${id}`)
}

module.exports.destroy = async (req, res) => {
  let { id } = req.params
  let datadeleted = await List.findByIdAndDelete(id)
  req.flash("success", "Listing deleted sucessfully")
  res.redirect("/listings")


}