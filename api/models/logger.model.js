const { model, Schema } = require('mongoose');

const loggerSchema = new Schema(
  {},
  {
    strict: false,
    collection: 'logger'
  }
);

module.exports = model('logger', loggerSchema);
