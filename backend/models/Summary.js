const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  transcript: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Summary', summarySchema);