const express = require("express")
const router = express.Router()       
const Trip = require("../models/trip.js")
const verifyToken = require("../middleware/verify-token.js")
const Destination = require("../models/destination.js")

//Find all trips
router.get("/", verifyToken, async (req, res) => {
    try {
      const trip =  await Trip.find({}).populate("author")

      res.status(201).json(trip)

    } catch (error) {
      res.status(500).json({error : error.message})
  }
})

//Create Trips
router.post("/", verifyToken, async (req, res) => {
    try {
      req.body.author = req.user._id

      const trip = await Trip.create(req.body)

      trip._doc.author = req.user
      res.status(201).json(trip)
    } catch (error) {
      res.status(400).json({ error: error.message })
  }
})

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

    // Check permissions
    if(!trip.author.equals(req.user._id)) {
      return res.status(403).send("Your not allowed to do that")
    }

    // Update Trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.tripId,
      req.body,
      {new: true}
    )

    // append req.user to the author property
    updatedTrip._doc.author = req.user

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

    // Check permissions
    if(!trip.author.equals(req.user._id)) {
      return res.status(403).send("Your not allowed to do that")
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
    // add the reviews author to the req.body
    req.body.author = req.user._id

    // Find Trip add review
    const trip = await Trip.findById(req.params.tripId)
    trip.reviews.push(req.body)

    // save the updated trip with review to the DB
    await trip.save()

    const newReview = trip.reviews[trip.reviews.length - 1]

    // populate author 
    newReview._doc.author = req.user

    res.status(200).json(newReview)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


module.exports = router