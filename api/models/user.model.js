const { model, Schema } = require('mongoose');

const bcrypt = require('bcrypt');

const userSchema = new Schema({
  login: {
    type: String,
    trim: true,
    unique: 'User login must is unique',
    required: 'User login must is required'
  },
  password: {
    type: String,
    trim: true,
    minLength: 4,
    required: 'User password must is required'
  },
  name: {
    type: String,
    trim: true,
    required: 'User name must is required'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: 'User email must is unique',
    required: 'User email must is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    default: '+xx(xxx)xxx-xx-xx'
  },
  isActive: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  scope: { type: Array, default: [] }
});

userSchema.statics.setDefaultAdmin = async function (user, BCRYPT_SALT) {
  const count = await this.countDocuments();
  if (!count) {
    const salt = bcrypt.genSaltSync(BCRYPT_SALT);
    const { login, name, email } = user;
    await this.create({
      login,
      password: bcrypt.hashSync(user.password, salt),
      name,
      email,
      isActive: true,
      isAdmin: true
    });
    return;
  }
  return;
};

userSchema.statics.toResponse = function (user) {
  return {
    id: user._id.toString(),
    login: user.login,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isActive: user.isActive,
    isAdmin: user.isAdmin,
    scope: user.scope,
    created: user.created
  };
};

userSchema.statics.toToken = function (user) {
  return {
    id: user._id.toString(),
    login: user.login,
    isActive: user.isActive,
    isAdmin: user.isAdmin
  };
};

module.exports = model('user', userSchema);
