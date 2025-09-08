const mongoose = require("mongoose")

const destinationSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    attractions : [{type : mongoose.Schema.Types.ObjectId, ref : "Attraction"}],
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
}, {timestamps: true})

const Destination = mongoose.model("Destination", destinationSchema)

module.exports = Destination