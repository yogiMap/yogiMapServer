const Client = require('../Model');
const message = require('../../utils/messages');

const clientAddAddressQuery = ({ clientId, addressId }) => {
  return Client.updateOne(
    { _id: clientId },
    { $addToSet: { addresses: addressId } },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('Client add address is not updated');
      }
    })
    .catch((error) => {
      return message.fail('Client add address error', error);
    });
};

module.exports = clientAddAddressQuery;
