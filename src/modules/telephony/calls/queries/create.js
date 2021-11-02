const mongoose = require('mongoose');
const message = require('../../../utils/messages');
const Call = require('../Model');

const createCall = (values) => {
  const _id = values._id || new mongoose.Types.ObjectId();

  const call = new Call({
    _id,
    ...values,
  });

  return call
    .save()
    .then(() => {
      return message.success('Call created', _id);
    })
    .catch((err) => {
      return message.fail('Call create error', err);
    });
};

module.exports = createCall;
