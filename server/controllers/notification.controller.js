const Notification = require('../models/notification.model');

const findAll = async (req, res, next) => {
  try {
    const items = await Notification.find({ userID: req.user.id });
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const createMany = async (req, res, next) => {
  try {
    const { title, text, users } = req.body;

    await users.forEach((el) => {
      Notification.create({
        title,
        text,
        userID: el
      });
    });

    res.status(200).json('Ok');
  } catch (err) {
    next(err);
  }
};

const removeOne = async (req, res, next) => {
  try {
    const item = await Notification.deleteOne({ _id: req.params.id, userID: req.user.id });
    if (item) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

module.exports = { findAll, createMany, removeOne };
