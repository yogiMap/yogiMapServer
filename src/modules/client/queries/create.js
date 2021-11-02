const mongoose = require('mongoose');
const Client = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');

module.exports = function createClientQuery(values) {
  const _id = new mongoose.Types.ObjectId();

  const client = new Client({
    _id,
    name: `${values.firstName} ${values.lastName}`,
    ...values,
  });

  return client
    .save()
    .then(() => {
      return message.success('Client created', _id);
    })
    .catch((error) => {
      const analyticsId = analytics('CLIENT_CREATE_ERROR', {
        error,
        body: values,
        entity: 'Client',
        entityId: _id,
        user: values.userId,
        controller: 'clientCreate',
      });

      return message.fail('Client create error', analyticsId);
    });
};
