const mongoose = require('mongoose');

//Schema for saving users information
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true}
});

module.exports = userSchema;