const { model, Schema } = require('mongoose');

const inspectorSchema = new Schema(
  {
    host: {
      type: String,
      trim: true,
      unique: 'Host address must is unique',
      required: 'Host address must is required'
    }
  },
  {
    strict: false
  }
);

module.exports = model('inspector', inspectorSchema);
