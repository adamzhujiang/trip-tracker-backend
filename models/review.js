const mongoose = require("mongoose")
const User = require("../models/user.js")

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

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review