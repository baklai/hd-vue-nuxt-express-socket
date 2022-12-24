const { model, Schema } = require('mongoose');

const locationSchema = new Schema({
  title: {
    type: String,
    trim: true,
    unique: 'Location must is unique',
    required: 'Location must is required'
  },
  region: {
    type: String,
    trim: true,
    default: null
  }
});

module.exports = model('location', locationSchema);
