const { model, Schema } = require('mongoose');

const branchSchema = new Schema({
  title: {
    type: String,
    trim: true,
    unique: 'Branch must is unique',
    required: 'Branch must is required'
  },
  address: {
    type: String,
    trim: true,
    default: null
  },
  comment: { type: String, trim: true, default: null }
});

module.exports = model('branch', branchSchema);
