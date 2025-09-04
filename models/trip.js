const mongoose = require("mongoose")
const User = require("../models/user.js")
const Review = require("../models/review.js")


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
        required
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
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews"
    },
    destination: [destinationSchema]
}, {timestamps: true})

const Trip = mongoose.model("Trip", tripSchema)

module.exports = Trip