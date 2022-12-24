const { model, Schema } = require('mongoose');

const requestSchema = new Schema({
  fullname: {
    type: String,
    trim: true,
    required: 'Client name is required'
  },

  phone: {
    type: String,
    trim: true,
    required: 'Client phone number is required'
  },

  position: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'position'
  },

  ipaddress: { type: String, trim: true, default: null },

  mail: {
    type: String,
    trim: true
  },

  location: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'location'
  },

  company: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'company'
  },

  branch: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'branch'
  },

  enterprise: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'enterprise'
  },

  department: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'department'
  },

  request: {
    type: String,
    trim: true,
    required: 'Client request is required'
  },

  workerOpen: {
    type: Schema.Types.ObjectId,
    trim: true,
    autopopulate: true,
    required: 'Worker is required',
    ref: 'user'
  },

  workerClose: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'user'
  },

  closed: { type: Date, trim: true, default: null },

  comment: { type: String, trim: true, default: null },

  conclusion: { type: String, trim: true, default: null }
});

module.exports = model('request', requestSchema);
