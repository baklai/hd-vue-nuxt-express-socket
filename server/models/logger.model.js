const { model, Schema } = require('mongoose');

const loggerSchema = new Schema({}, { strict: false, timestamps: false });

module.exports = model('logger', loggerSchema);
