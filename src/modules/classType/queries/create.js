const mongoose = require('mongoose');
const ClassType = require('../Model');
const message = require('../../utils/messages');

module.exports = function createClassTypeQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const classType = new ClassType({
    _id,
    ...values,
  });

  return classType
    .save()
    .then(() => {
      return message.success('ClassType created', _id);
    })
    .catch((err) => {
      return message.fail('ClassType create error', err);
    });
};
