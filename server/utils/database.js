const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.plugin(require('../plugins/mongoose'));
mongoose.plugin(require('mongoose-unique-validator'));
mongoose.plugin(require('mongoose-autopopulate'));
mongoose.plugin(require('mongoose-paginate'));

const User = require('../models/user.model');

const mongodb = async (MONGO_URI, BCRYPT_SALT) => {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Success MongoDB connected');
    await User.setDefaultAdmin(
      {
        login: 'helpdesk',
        password: 'helpdesk',
        name: 'Administrator',
        email: 'helpdesk@helpdesk.io',
        isActive: true,
        isAdmin: true
      },
      BCRYPT_SALT
    );
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(0);
  }
};

module.exports = async (MONGO_URI) => {
  await mongodb(MONGO_URI);
};
