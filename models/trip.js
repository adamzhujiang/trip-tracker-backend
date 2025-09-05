const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    rating: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

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
}, {timestamps: true})

const tripSchema = new mongoose.Schema({
    travelers: {
        type: String,
        required: true,
    },
    trip_duration: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    destination: [destinationSchema],
    reviews: [reviewSchema],
}, {timestamps: true})

const Trip = mongoose.model("Trip", tripSchema)

module.exports = Trip