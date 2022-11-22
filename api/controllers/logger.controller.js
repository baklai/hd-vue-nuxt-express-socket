const Logger = require('../models/logger.model');

const findAll = async (req, res, next) => {
  try {
    const o = Object.assign({}, JSON.parse(req.query.options));
    const f = Object.assign({}, JSON.parse(req.query.filters));
    let options = {};
    options.page = o.page || 1;
    if (Number(o.itemsPerPage) === -1) {
      options.limit = await Logger.countDocuments();
    } else {
      options.limit = Number(o.itemsPerPage);
    }
    options.lean = false;
    options.sort = '-date';
    options.select = '';
    let filters = {};
    if (f.date) filters.date = { $regex: f.date, $options: 'i' };
    if (f.log) filters.log = { $regex: f.log, $options: 'i' };

    const items = await Logger.paginate({ ...filters }, { ...options });
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const removeAll = async (req, res, next) => {
  try {
    const item = await Logger.deleteMany({});
    if (item) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findAll,
  removeAll
};
