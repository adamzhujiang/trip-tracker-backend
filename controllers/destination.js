const mongoose = require('mongoose')
const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const router = express.Router({mergeParams: true})
const Destination = require("../models/destination.js")
const Trip = require("../models/trip.js")


// add destination to trip
router.post("/", verifyToken, async (req, res) => {
  try {
    // Find Trip
    const trip = await Trip.findById(req.params.tripId)
    if (!trip) return res.status(404).json({ error: "Trip not found" })
    
    req.body.author = req.user._id
    req.body.trip = trip._id

    const destination = await Destination.create(req.body)

    // add destinations
    trip.destinations.push(destination._id)

    // save destinations to trip
    await trip.save()

    // populate author
    await destination.populate("author")

    res.status(201).json(destination)
  } catch (error) {
    res.status(400).json({ error: error.message })
}
})

// Show destination 
router.get("/:destinationId", verifyToken, async (req, res) => {
  try {

    const destination = await Destination.findById(req.params.destinationId).populate("author")

    if (!destination) return res.status(404).json({ error: "Destination not found" })

    res.json(destination)
  } catch (error) {
    res.status(500).json({ error: error.message })
}
})

// Update Destination
router.put("/:destinationId", verifyToken, async (req, res) => {
  try {
    // Find Trip
    const trip = await Trip.findById(req.params.tripId)
    if (!trip) return res.status(404).json({ error: "Trip not found" })
    
    // Check permissions
    if(!trip.author.equals(req.user._id)) {
      return res.status(403).send("Your not allowed to do that")
    }

    // Update Destination
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.destinationId,
      req.body,
      {new: true}
    )

    // populate author
    updatedDestination._doc.author = req.user

    res.status(200).json(updatedDestination)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete destination 
router.delete("/:destinationId", verifyToken,  async (req, res) => {
  try {
    // Find Trip
    const trip = await Trip.findById(req.params.tripId)
    if (!trip) return res.status(404).json({ error: "Trip not found" })
        
    // Check permissions
    if(!trip.author.equals(req.user._id)) {
      return res.status(403).send("Your not allowed to do that")
    }
    // delete destination
    const deletedDestination = await Destination.findByIdAndDelete(req.params.destinationId)

    res.status(200).json(deletedDestination)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})



module.exports = router