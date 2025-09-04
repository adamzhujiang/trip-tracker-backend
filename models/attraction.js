const mongoose = require("mongoose")

const attractionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip"
    }
    
}, {timestamps: true})

const Attraction = mongoose.model("Attraction", attractionSchema)

module.exports = Attraction