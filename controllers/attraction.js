const mongoose = require("mongoose")
const express = require("express")
const verifyToken = require("../middleware/verify-token.js")
const router = express.Router({mergeParams : true})

const Attraction = require("../models/attraction.js")
const Destination = require("../models/destination.js")

// Show All Attractions
router.get("/", verifyToken, async (req, res) => {
    try {
        const attractions = await Attraction.find({}).populate("author")

        res.status(201).json(attractions)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
})


// add attraction to destination
router.post("/", verifyToken, async (req, res) => {
    try {
      // Find destination
      const destination = await Destination.findById(req.params.destinationId)
      if (!destination) return res.status(404).json({ error: "Destination not found" })
      
      req.body.author = req.user._id
      req.body.destination = destination._id
  
      const attraction = await Attraction.create(req.body)
  
      // add attractions
      destination.attractions.push(attraction._id)
  
      // save attractions to destiantion
      await destination.save()
  
      // populate author
      await attraction.populate("author")
  
      res.status(201).json(attraction)
    } catch (error) {
      res.status(400).json({ error: error.message })
  }
  })

// Show Attraction 
router.get("/:attractionId", verifyToken, async (req, res) => {
    try {
      const attraction = await Attraction.findById(req.params.attractionId)
        .populate("author", "firstName lastName email")
        .populate("destination", "country city description")
      

      if (!attraction) return res.status(404).json({ error: "Attraction not found" })

      res.json(attraction)
    } catch (error) {
      res.status(500).json({ error: error.message })
  }
})

// Update Attraction
router.put("/:attractionId", verifyToken, async (req, res) => {
    try {
      // Find Destination
      const destination = await Destination.findById(req.params.destinationId)
      if (!destination) return res.status(404).json({ error: "Destination not found" })
      
      // Check permissions
      if(!destination.author.equals(req.user._id)) {
        return res.status(403).send("Your not allowed to do that")
      }
  
      // Update attraction
      const updatedAttraction = await Attraction.findByIdAndUpdate(
        req.params.attractionId,
        req.body,
        {new: true}
      )
  
      // populate author
      updatedAttraction._doc.author = req.user
  
      res.status(200).json(updatedAttraction)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

// Delete Attraction 
router.delete("/:attractionId", verifyToken, async (req, res) => {
    try {
      // Find Destination
      const destination = await Destination.findById(req.params.destinationId)
      if (!destination) return res.status(404).json({ error: "Destination not found" })
      
      // Check permissions
      if(!destination.author.equals(req.user._id)) {
            return res.status(403).send("Your not allowed to do that")
        }

      const attraction = await Attraction.findById(req.params.attractionId)

      if(!attraction.author.equals(req.user._id)) {
            return res.status(403).send("Your not allowed to do that!")
        } 

      const deletedAttraction = await Attraction.findByIdAndDelete(req.params.attractionId)

      res.status(201).json(deletedAttraction)

    } catch (error) {
      res.status(500).json({error : error.message}) 
    }
})

// Create attraction Review 
router.post("/:attractionId/reviews", verifyToken, async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.attractionId).populate("author")
        if(!attraction) {
            return res.status(404).json({error : "Attraction not found"})
        }

        attraction.attractionReviews.push(req.body)

        await attraction.save()

        const newReview = attraction.attractionReviews[attraction.attractionReviews.length -1]
        newReview._doc.author = req.user

        res.status(201).json(newReview)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
})


module.exports = router
