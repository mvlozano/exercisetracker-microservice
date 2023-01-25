const mongoose = require('mongoose');

//Schema for saving exercise information
const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Number, required: true }
});

module.exports = exerciseSchema;