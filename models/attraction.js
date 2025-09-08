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
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    attractionReviews : [reviewSchema]
}, {timestamps: true})

const Attraction = mongoose.model("Attraction", attractionSchema)

module.exports = Attraction