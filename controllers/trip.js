const express = require("express")
const router = express.Router()       
const Trip = require("../models/trip.js")
const verifyToken = require("../middleware/verify-token.js")

// GET /trips
router.get("/trips", async (req, res) => {
  try {
    const trips = await Trip.find({}).populate("author")
    res.json(trips)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

// GET /trips/new
router.get("/trips/new", verifyToken, (req, res) => {
  res.json({ message: "Trip creation form placeholder" })
})

//Post /trips/create

router.post("/trips/create", verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id

        const trip = await Trip.create(req.body)

        trip._doc.author = req.user
            res.status(201).json(trip)
    } catch (err) {
    res.status(400).json({ err: err.message })
    }
})

// GET /trips/1
router.get("/trips/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("author")
    if (!trip) return res.status(404).json({ err: "Trip not found" })
    res.json(trip)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

// GET /trips/1/edit
router.get("/trips/:id/edit", verifyToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    if (!trip) return res.status(404).json({ err: "Trip not found" })

    if (trip.author.toString() !== req.user._id) {
      return res.status(403).json({ err: "Unauthorized" })
    }

    res.json({ message: "Trip edit form placeholder", trip })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

// PATCH/PUT /trips/1 Update

//DELETE

router.delete("/trips/:id", verifyToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    if (!trip) return res.status(404).json({ err: "Trip not found" })

    if (trip.author.toString() !== req.user._id) {
      return res.status(403).json({ err: "Unauthorized" })
    }

    await trip.deleteOne()
    res.json({ message: "Trip deleted" })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

module.exports = router