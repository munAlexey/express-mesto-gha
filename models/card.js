const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  owner: {
    type: mongoose.Schema.type.ObjectId,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  likes: {
    type: mongoose.Schema.type.ObjectId,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', cardSchema);