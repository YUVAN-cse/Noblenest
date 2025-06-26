const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/noblenest";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log(initData.data)
  initData.data = initData.data.map((obj) => ({...obj,owner:'684e6326ffa4ecf38dd82ee7',geometry: {
  type: "Point",
  coordinates: [77.5946, 12.9716] // [longitude, latitude] — e.g., Bangalore
}}) )
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
