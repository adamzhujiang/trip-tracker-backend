const express = require("express")
const router = express.Router()       
const Trip = require("../models/trip.js")
const verifyToken = require("../middleware/verify-token.js")

//Post /trips/create

router.post("/", verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id

        const trip = await Trip.create(req.body)

        trip._doc.author = req.user
            res.status(201).json(trip)
    } catch (err) {
    res.status(400).json({ err: err.message })
    }
})



module.exports = router