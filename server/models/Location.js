const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Location',
  new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true, trim: true },
      description: { type: String, trim: true },
    },
    { timestamps: true }
  )
);
