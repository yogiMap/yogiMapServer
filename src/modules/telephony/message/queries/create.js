const mongoose = require('mongoose');
const message = require('../../../utils/messages');
const Message = require('../Model');

module.exports = function messageCreateQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const sms = new Message({
    _id,
    ...values,
  });

  return sms
    .save()
    .then(() => {
      return message.success('Message created', _id);
    })
    .catch((err) => {
      return message.fail('Message create error', err);
    });
};
