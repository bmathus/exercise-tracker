const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  count: {
    required: true,
    type: Number,
  },
  log: [
    {
      description: {
        required: true,
        type: String,
      },
      duration: {
        required: true,
        type: Number,
      },
      date: {
        required: true,
        type: Date,
      },
    },
  ],
});

const Model = mongoose.model('Model', schema);

module.exports = { Model };
