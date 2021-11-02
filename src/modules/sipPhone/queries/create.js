const mongoose = require('mongoose');
const SipPhone = require('../Model');
const message = require('../../utils/messages');

module.exports = function createSipPhoneQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const sipPhone = new SipPhone({
    _id,
    ...values,
  });

  return sipPhone
    .save()
    .then(() => {
      return message.success('SipPhone created', _id);
    })
    .catch((err) => {
      return message.fail('SipPhone create error', err);
    });
};
