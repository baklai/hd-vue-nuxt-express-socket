const { model, Schema } = require('mongoose');

const enterpriseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    unique: 'Enterprise must is unique',
    required: 'Enterprise must is required'
  },
  address: {
    type: String,
    trim: true,
    default: null
  },
  comment: { type: String, trim: true, default: null }
});

module.exports = model('enterprise', enterpriseSchema);
