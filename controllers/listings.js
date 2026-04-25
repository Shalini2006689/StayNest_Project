const Listing = require("../models/listing");
// const maptilerClient = require("@maptiler/client");
const ExpressError = require("../utils/ExpressError.js");

// maptilerClient.config.apiKey = process.env.MAP_TOKEN;

module.exports.index = async (req, res) => {
  const { q = "", category = "all" } = req.query;
  const normalizedCategory = category.toLowerCase();

  const allListings = await Listing.find({}).lean();

  const normalizedListings = allListings
    .map((listing) => ({
      ...listing,
      category: (listing.category || "Trending").toLowerCase(),
    }))
    .filter((listing) => {
      const location = (listing.location || "").toLowerCase();
      // const listingCategory = (listing.category || "").toLowerCase();
      const queryText = q.trim().toLowerCase();

      const matchesQuery = !queryText || location.includes(queryText);
      const matchesCategory =
        normalizedCategory === "all" || listing.category === normalizedCategory;

      return matchesQuery && matchesCategory;
    });
  res.render("listings/index.ejs", {
    allListings: normalizedListings,
    activeCategory: normalizedCategory,
    searchQuery: q,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// show route
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The listing you are looking for does not exist!");

    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  if (!req.file) {
    throw new ExpressError(400, "Please upload a Listing image");
  }

  const newListing = new Listing(req.body.listing);
  newListing.category = (req.body.listing.category || "trending").toLowerCase();
  const { path: url, filename } = req.file;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

// GeoCoding

  await newListing.save();
  req.flash("success", "New listing added successfully!");
  res.redirect("/listings");
};

//Edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true },
  );
  if (req.body.listing.category) {
  listing.category = req.body.listing.category.toLowerCase();
}
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (req.file) {
    const { path: url, filename } = req.file;
    listing.image = { url, filename };
  }

  // GeoCoding

  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};