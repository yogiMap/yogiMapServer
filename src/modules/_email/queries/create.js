const mongoose = require('mongoose');
const Email = require('../Model');
const message = require('../../utils/messages');

function createEmailQuery(values) {
  const _id = new mongoose.Types.ObjectId();

  const email = new Email({
    _id,
    ...values,
    isRead: false,
  });

  return email
    .save()
    .then(() => {
      return message.success('Email created', _id);
    })
    .catch((err) => {
      return message.fail('Email create error', err);
    });
}

module.exports = createEmailQuery;
