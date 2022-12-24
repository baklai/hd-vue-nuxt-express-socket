const { model, Schema } = require('mongoose');

const companySchema = new Schema({
  title: {
    type: String,
    trim: true,
    unique: 'Сompany must is unique',
    required: 'Сompany must is required'
  },
  address: {
    type: String,
    trim: true,
    default: null
  },
  comment: { type: String, trim: true, default: null }
});

module.exports = model('company', companySchema);
