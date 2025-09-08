const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

}, {timestamps: true} )

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.password
    }
})

const User = mongoose.model("User", userSchema)
 
module.exports = User