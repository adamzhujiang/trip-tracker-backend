// /controllers/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/user.js")
const jwt = require("jsonwebtoken")

const saltRounds = 12

router.post('/sign-up', async (req, res) => {
  try {
    // make sure a user with this username does not exist
    const userInDatabase = await User.findOne({email: req.body.email})

    if(userInDatabase) {
      return res.status(409).json({err: "Email already taken"})
    }

    // no user with that username, lets create new user
    const user = await User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: bcrypt.hashSync(req.body.password, saltRounds)
    })
    // Create a new auth jwt token for the new user
    const payload = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id : user._id}

    const token = jwt.sign({ payload }, process.env.JWT_SECRET)

    res.status(201).json({ token })

  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    // make sure a user with this username does not exist
    const userInDatabase = await User.findOne({email: req.body.email})

    if(!userInDatabase) {
      return res.status(409).json({err: "Invalid Credentials, user does not exist"})
    }
    // this will return true if the password match and false if the do not
    const isPasswordCorrect = bcrypt.compareSync(req.body.password,
      userInDatabase.password)

    if(!isPasswordCorrect) {
      return res.status(401).json({err: "Invalid Password"})
    }

    const payload = { email: userInDatabase.email, _id : userInDatabase._id}
    
    // Create a new auth jwt token for the new user
    const token = jwt.sign({ payload }, process.env.JWT_SECRET)

    res.status(200).json({ token })

  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

module.exports = router;
