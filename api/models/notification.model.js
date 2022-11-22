const { model, Schema } = require('mongoose');

var notificationSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title must is required'
  },
  text: {
    type: String,
    trim: true,
    required: 'Text must is required'
  },
  userID: {
    type: Schema.Types.ObjectId,
    trim: true,
    required: 'User must is required',
    ref: 'user'
  }
});

module.exports = model('notification', notificationSchema);
