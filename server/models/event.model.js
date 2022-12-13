const { model, Schema } = require('mongoose');
const moment = require('moment');

const eventSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Event must is required'
  },
  date: {
    type: Date,
    required: 'Event date start must is required'
  },
  href: {
    type: String,
    trim: true,
    default: null
  },
  comment: { type: String, trim: true, default: null }
});

eventSchema.virtual('start').get(function () {
  return moment(this.date).format('YYYY-MM-DD hh:mm');
});

module.exports = model('event', eventSchema);
