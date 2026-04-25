const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { data: sampleListings } = require("./init/data.js");

require("dotenv").config();

mongoose.connect( process.env.ATLASDB_URL);

const initDB = async () => {
  await Listing.deleteMany({});

  const USER_ID = process.env.SEED_USER_ID; 

  const listingsWithOwner = sampleListings.map((obj) => ({
    ...obj,
    owner: USER_ID,
  }));

  await Listing.insertMany(listingsWithOwner);

  console.log("Data initialized");
};

initDB();