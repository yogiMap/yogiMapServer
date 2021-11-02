const mongoose = require('mongoose');
const Classes = require('../Model');
const message = require('../../utils/messages');

module.exports = function createClassesQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const classes = new Classes({
    _id,
    ...values,
  });

  return classes
    .save()
    .then(() => {
      return message.success('Classes created', _id);
    })
    .catch((err) => {
      return message.fail('Classes create error', err);
    });
};
