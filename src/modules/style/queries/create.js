const mongoose = require('mongoose');
const Style = require('../Model');
const message = require('../../utils/messages');

module.exports = function createStyleQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const style = new Style({
    _id,
    ...values,
  });

  return style
    .save()
    .then(() => {
      return message.success('Style created', _id);
    })
    .catch((err) => {
      return message.fail('Style create error', err);
    });
};
