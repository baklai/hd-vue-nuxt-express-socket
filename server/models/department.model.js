const { model, Schema } = require('mongoose');

const departmentSchema = new Schema({
  title: {
    type: String,
    trim: true,
    unique: 'Department must is unique',
    required: 'Department must is required'
  },
  address: {
    type: String,
    trim: true,
    default: null
  },
  comment: { type: String, trim: true, default: null }
});

module.exports = model('department', departmentSchema);
