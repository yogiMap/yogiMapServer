const mongoose = require('mongoose');
const Event = require('../Model');
const message = require('../../utils/messages');

module.exports = function createEventQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const event = new Event({
    _id,
    ...values,
  });

  return event
    .save()
    .then(() => {
      return message.success('Event created', _id);
    })
    .catch((err) => {
      return message.fail('Event create error', err);
    });
};
