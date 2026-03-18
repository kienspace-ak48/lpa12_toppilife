const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports =  mongoose.model("visit", visitSchema);