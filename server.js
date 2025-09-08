const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const authRouter = require('./controllers/auth');
const userRouter = require("./controllers/user.js")
const destinationRouter = require("./controllers/destination.js")
const tripRouter = require("./controllers/trip.js")
const attractionRouter = require("./controllers/attraction.js")

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/auth', authRouter);
app.use("/user", userRouter)
app.use('/trips', tripRouter)
app.use("/trips/:tripId/destinations", destinationRouter)
app.use("/destinations/:destinationId/attractions", attractionRouter)

app.listen(3000, () => {
  console.log(`The express app is on port ${3000}!`);
});
