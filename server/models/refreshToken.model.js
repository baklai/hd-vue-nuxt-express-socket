const { model, Schema } = require('mongoose');

const refreshTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: 'User ID must is required',
    ref: 'user'
  },
  token: {
    type: String,
    trim: true,
    unique: 'Refresh token must is unique',
    required: 'Refresh token must is required'
  }
});

module.exports = model('refreshToken', refreshTokenSchema);
