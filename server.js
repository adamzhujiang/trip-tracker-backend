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


app.use(cors({
  origin: 'https://trip-tracker-travel.netlify.app/', // replace with your actual Netlify URL
  credentials: true
}));
app.use(express.json());
app.use(logger('dev'));


// Root route (health check)
app.get("/", (req, res) => {
  res.send("Trip Tracker Backend is live!");
});  


// Routes go here
app.use('/auth', authRouter);
app.use("/user", userRouter)
app.use('/trips', tripRouter)
app.use("/trips/:tripId/destinations", destinationRouter)
app.use("/destinations/:destinationId/attractions", attractionRouter)



const PORT = process.env.PORT || 3000; // use Heroku port or fallback to 3000 for local dev
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});














