const { model, Schema } = require('mongoose');

const vpnSchema = new Schema({
  vpn: {
    type: String,
    trim: true,
    default: null
  },
  ipaddress: {
    type: String,
    trim: true,
    default: null
  },
  login: {
    type: String,
    trim: true,
    default: null
  },
  unit: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'unit'
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
  position: {
    type: Schema.Types.ObjectId,
    trim: true,
    default: null,
    autopopulate: true,
    ref: 'position'
  },
  fullname: {
    type: String,
    trim: true,
    default: null
  },
  phone: {
    type: String,
    trim: true,
    default: null
  },
  mail: {
    type: String,
    trim: true,
    default: null
  },
  dateOpen: {
    type: Date,
    default: null
  },
  dateClose: {
    type: Date,
    default: null
  },
  service: {
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

vpnSchema.virtual('vpnStatus').get(function () {
  if (!this.mail && !this.dateOpen && !this.dateClose) {
    return { isActive: false, icon: 'mdi-minus', color: 'default' };
  } else if (this.dateClose) {
    return {
      isActive: false,
      icon: 'mdi-block-helper',
      color: 'red'
    };
  } else if (this.dateOpen && !this.dateClose) {
    return {
      isActive: true,
      icon: 'mdi-check-bold',
      color: 'green'
    };
  } else return { isActive: false, icon: 'mdi-minus', color: 'default' };
});

module.exports = model('vpn', vpnSchema);
