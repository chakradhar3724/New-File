const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: String,
  description: String,
  example: String,
});

module.exports = mongoose.model('Question', QuestionSchema);