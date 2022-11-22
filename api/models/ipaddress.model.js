const { model, Schema } = require('mongoose');

const Netmask = require('netmask').Netmask;

const ipaddressSchema = new Schema({
  ipaddress: {
    type: String,
    trim: true,
    unique: 'IP Address must is unique',
    required: 'IP Address must is required'
  },

  indexip: {
    type: Number
  },

  cidr: {
    type: Object,
    required: 'CIDR must is required',
    default: { value: 24, mask: '255.255.255.0' },
    enum: [
      { value: 32, mask: '255.255.255.255' },
      { value: 31, mask: '255.255.255.254' },
      { value: 30, mask: '255.255.255.252' },
      { value: 29, mask: '255.255.255.248' },
      { value: 28, mask: '255.255.255.240' },
      { value: 27, mask: '255.255.255.224' },
      { value: 26, mask: '255.255.255.192' },
      { value: 25, mask: '255.255.255.128' },
      { value: 24, mask: '255.255.255.0' },
      { value: 23, mask: '255.255.254.0' },
      { value: 22, mask: '255.255.252.0' },
      { value: 21, mask: '255.255.248.0' },
      { value: 20, mask: '255.255.240.0' },
      { value: 19, mask: '255.255.224.0' },
      { value: 18, mask: '255.255.192.0' },
      { value: 17, mask: '255.255.128.0' },
      { value: 16, mask: '255.255.0.0' },
      { value: 15, mask: '255.254.0.0' },
      { value: 14, mask: '255.252.0.0' },
      { value: 13, mask: '255.248.0.0' },
      { value: 12, mask: '255.240.0.0' },
      { value: 11, mask: '255.224.0.0' },
      { value: 10, mask: '255.192.0.0' },
      { value: 9, mask: '255.128.0.0' },
      { value: 8, mask: '255.0.0.0' },
      { value: 7, mask: '254.0.0.0' },
      { value: 6, mask: '252.0.0.0' },
      { value: 5, mask: '248.0.0.0' },
      { value: 4, mask: '240.0.0.0' },
      { value: 3, mask: '224.0.0.0' },
      { value: 2, mask: '192.0.0.0' },
      { value: 1, mask: '128.0.0.0' },
      { value: 0, mask: '0.0.0.0' }
    ]
  },

  unit: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'unit'
  },

  internet: {
    mail: { type: String, trim: true, default: null },
    dateOpen: { type: Date, default: null },
    dateClose: { type: Date, default: null },
    comment: { type: String, trim: true, default: null }
  },

  email: {
    type: [
      {
        mail: { type: String, trim: true, default: null },
        login: { type: String, trim: true, default: null },
        fullname: { type: String, trim: true, default: null },
        dateOpen: { type: Date, default: null },
        dateClose: { type: Date, default: null },
        comment: { type: String, trim: true, default: null }
      }
    ],
    default: []
  },

  autoanswer: {
    type: String,
    trim: true,
    default: null
  },

  mail: {
    type: String,
    trim: true,
    default: null
  },

  date: {
    type: Date,
    default: null
  },

  location: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'location'
  },

  company: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'company'
  },

  branch: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'branch'
  },

  enterprise: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'enterprise'
  },

  department: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'department'
  },

  fullname: {
    type: String,
    trim: true,
    default: null
  },

  position: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'position'
  },

  phone: {
    type: String,
    trim: true,
    default: null
  },

  comment: {
    type: String,
    trim: true,
    default: null
  }
});

ipaddressSchema.virtual('mask').get(function () {
  return this.cidr
    ? new Netmask(`${this.ipaddress}/${this.cidr.value}`).mask
    : null;
});

ipaddressSchema.virtual('gateway').get(function () {
  return this.cidr
    ? new Netmask(`${this.ipaddress}/${this.cidr.value}`).first
    : null;
});

ipaddressSchema.virtual('status.internet').get(function () {
  if (!this.internet) {
    return false;
  } else if (
    this.internet.mail &&
    this.internet.dateOpen &&
    !this.internet.dateClose
  ) {
    return true;
  } else {
    return false;
  }
});

ipaddressSchema.virtual('status.email').get(function () {
  if (!this.email) {
    return false;
  } else if (this.email.length === 0) {
    return false;
  } else if (
    this.email.find(
      (item) => item.login && item.mail && item.dateOpen && !item.dateClose
    )
  ) {
    return true;
  } else return false;
});

module.exports = model('ipaddress', ipaddressSchema);
