const Department = require('../models/department.model');

const findAll = async (req, res, next) => {
  try {
    const items = await Department.find({});
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const item = await Department.findById(req.params.id);
    if (item) res.status(200).json(item);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

const createOne = async (req, res, next) => {
  try {
    const item = await Department.create({ ...req.body });
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const item = await Department.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body
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
    const item = await Department.deleteOne({ _id: req.params.id });
    if (item) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

module.exports = { findAll, findOne, createOne, updateOne, removeOne };
