const Client = require('../Model');
const message = require('../../utils/messages');

const clientAddOrderQuery = ({ clientId, orderId }) => {
  return Client.updateOne(
    { _id: clientId },
    { $addToSet: { orders: orderId } },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('Client add order is not updated');
      }
    })
    .catch((error) => {
      return message.fail('Client add order error', error);
    });
};

module.exports = clientAddOrderQuery;
