const { model, Schema } = require('mongoose');

var channelSchema = new Schema({
  locationFrom: {
    type: String,
    trim: true,
    default: '-'
  },
  unitFrom: {
    type: String,
    trim: true,
    default: '-'
  },
  locationTo: {
    type: String,
    trim: true,
    default: '-'
  },
  unitTo: {
    type: String,
    trim: true,
    default: '-'
  },
  level: {
    type: String,
    trim: true,
    default: '-'
  },
  type: {
    type: String,
    trim: true,
    default: '-'
  },
  speed: {
    type: String,
    trim: true,
    default: '-'
  },
  status: {
    type: String,
    trim: true,
    default: '-'
  },
  operator: {
    type: String,
    trim: true,
    default: '-'
  },
  composition: {
    type: String,
    trim: true,
    default: '-'
  }
});

module.exports = model('channel', channelSchema);
