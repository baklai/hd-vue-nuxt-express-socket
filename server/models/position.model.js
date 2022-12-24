const { model, Schema } = require('mongoose');

var positionSchema = new Schema({
  title: {
    type: String,
    trim: true,
    unique: 'Position must is unique',
    required: 'Position must is required'
  }
});

module.exports = model('position', positionSchema);
