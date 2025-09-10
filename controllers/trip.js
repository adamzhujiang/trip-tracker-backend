const express = require("express")
const router = express.Router()      
const Trip = require("../models/trip.js")
const verifyToken = require("../middleware/verify-token.js")
const Destination = require("../models/destination.js")


//Find all trips
router.get("/", verifyToken, async (req, res) => {
   try {
     const trip =  await Trip.find({}).populate("author")


     res.status(200).json(trip)


   } catch (error) {
     res.status(500).json({error : error.message})
 }
})


//Create Trips
router.post("/", verifyToken, async (req, res) => {
 try {
   req.body.author = req.user._id;  // author is set from the JWT
   const trip = await Trip.create(req.body);
   res.status(201).json(trip);
 } catch (err) {
   console.error("Create trip error:", err);
   res.status(400).json({ error: err.message });
 }
});


// Show Trip
router.get("/:tripId", verifyToken, async (req, res) => {
   try {
     const trip = await Trip.findById(req.params.tripId).populate("author")
     .populate(["destinations"]);


     if (!trip) return res.status(404).json({ error: "Trip not found" })
     res.json(trip)
   } catch (error) {
     res.status(500).json({ error: error.message })
 }
})


// Update Trip
router.put("/:tripId", verifyToken, async (req, res) => {
 try {
   // Find the Trip
   const trip = await Trip.findById(req.params.tripId)


   console.log("Trip Author:", trip.author.toString());
   console.log("Logged-in User:", req.user._id.toString());


   if (!trip) return res.status(404).json({ error: "Trip not found" });


   // Check permissions
   const authorId = trip.author._id ? trip.author._id.toString() : trip.author.toString();
   const userId = req.user._id.toString();
console.log("Trip object:", trip);
console.log("Trip author:", trip.author);
console.log("Logged-in user:", req.user);


   // Permission check
   if (authorId !== userId) {return res.status(403).json({ error: "You're not allowed to do that" });
   }


   // Update Trip
   const updatedTrip = await Trip.findByIdAndUpdate(
     req.params.tripId,
     req.body,
     {new: true, runValidators: true}
   ).populate("author")


   // append req.user to the author property
   // updatedTrip._doc.author = req.user


   res.status(200).json(updatedTrip)
 } catch (error) {
   res.status(500).json({ error: error.message })
 }
})


// Delete Trip
router.delete("/:tripId", verifyToken, async (req, res) => {
 try {
   // Find the Trip
   const trip = await Trip.findById(req.params.tripId)




   if (!trip) return res.status(404).json({ error: "Trip not found" });


   // Check permissions
   const authorId = trip.author._id ? trip.author._id.toString() : trip.author.toString();
   const userId = req.user._id.toString();
   console.log("Trip Author ID:", authorId);
   console.log("Logged-in User ID:", userId);


   if (authorId !== userId) {      return res.status(403).json({ error: "You're not allowed to do that" });
   }
    // Deleted Trip
   const deletedTrip = await Trip.findByIdAndDelete(req.params.tripId)


   res.status(200).json(deletedTrip)
 } catch (error) {
   res.status(500).json({ error: error.message })
 }


})


// Create Trip Reviews
router.post("/:tripId/reviews", verifyToken, async (req, res) => {
 try {
   req.body.author = req.user._id;


   const trip = await Trip.findById(req.params.tripId);
   if (!trip) return res.status(404).json({ error: "Trip not found" });


   trip.reviews.push(req.body);
   await trip.save();


   const newReview = trip.reviews[trip.reviews.length - 1];
   newReview._doc.author = req.user;


   res.status(200).json(newReview);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: error.message });
 }
});


module.exports = router

