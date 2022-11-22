const Netmask = require('netmask').Netmask;

const IPAddress = require('../models/ipaddress.model');

const findAll = async (req, res, next) => {
  try {
    const o = Object.assign({}, JSON.parse(req.query.options));
    const f = Object.assign({}, JSON.parse(req.query.filters));

    let options = {};

    options.page = o.page || 1;

    if (Number(o.itemsPerPage) === -1) {
      options.limit = await IPAddress.countDocuments();
    } else {
      options.limit = Number(o.itemsPerPage);
    }

    options.lean = false;
    options.sort = 'indexip'; // o.sortBy ? [o.sortBy, o.sortDesc] : 'indexip';
    options.select = '-cidr';

    let filters = {};

    if (f.unit) filters.unit = f.unit;
    if (f.location) filters.location = f.location;
    if (f.position) filters.position = f.position;
    if (f.company) filters.company = f.company;
    if (f.branch) filters.branch = f.branch;
    if (f.enterprise) filters.enterprise = f.enterprise;
    if (f.department) filters.department = f.department;

    if (f.ipaddress) filters.ipaddress = { $regex: f.ipaddress, $options: 'i' };
    if (f.fullname) filters.fullname = { $regex: f.fullname, $options: 'i' };
    if (f.phone) filters.phone = { $regex: f.phone, $options: 'i' };
    if (f.mail) filters.mail = { $regex: f.mail, $options: 'i' };
    if (f.autoanswer) filters.autoanswer = { $regex: f.autoanswer, $options: 'i' };

    if (f.internet) {
      filters['internet.mail'] = { $ne: null };
      filters['internet.dateOpen'] = { $ne: null };
      filters['internet.dateClose'] = null;
    }

    if (f.email) {
      filters['email.login'] = { $ne: null };
      filters['email.mail'] = { $ne: null };
      filters['email.dateOpen'] = { $ne: null };
      filters['email.dateClose'] = null;
    }

    const items = await IPAddress.paginate({ ...filters }, { ...options });
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const item = await IPAddress.findById(req.params.id);
    if (item) res.status(200).json(item);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

const searchOne = async (req, res, next) => {
  try {
    const item = await IPAddress.findOne({ ipaddress: req.params.ipaddress });
    if (item) res.status(200).json(item);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

const createOne = async (req, res, next) => {
  try {
    const indexip = new Netmask(req.body.ipaddress).netLong;
    const item = await IPAddress.create({ ...req.body, indexip });
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const indexip = new Netmask(req.body.ipaddress).netLong;

    const item = awaitIPAddress.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body,
        indexip
      }
    });
    if (item) res.status(200).json(item);
    else res.sendStatus(400);
  } catch (err) {
    next(err);
  }
};

const removeOne = async (req, res, next) => {
  try {
    const item = await IPAddress.deleteOne({ _id: req.params.id });
    if (item) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchOne,
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
};
