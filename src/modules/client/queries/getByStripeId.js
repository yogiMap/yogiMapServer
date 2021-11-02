const Client = require('../Model');
const message = require('../../utils/messages');

const clientGetByStripeIdQuery = (customerStripeId) => {
  return Client.findOne({ customerStripeId: customerStripeId })
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Client get by stripeId OK', doc);
      } else {
        return message.fail('No Client for provided stripeId');
      }
    })
    .catch((err) => {
      return message.fail('Get Client by stripeId ERROR', err);
    });
};

module.exports = clientGetByStripeIdQuery;
