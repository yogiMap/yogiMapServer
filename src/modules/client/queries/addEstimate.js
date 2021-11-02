const Client = require('../Model');
const message = require('../../utils/messages');

const clientAddEstimateQuery = ({ clientId, estimateId }) => {
  return Client.updateOne(
    { _id: clientId },
    { $addToSet: { estimates: estimateId } },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('The estimate added successfully', doc);
      } else {
        return message.fail('The estimate not updated');
      }
    })
    .catch((error) => {
      return message.fail('Error while adding estimate', error);
    });
};

module.exports = clientAddEstimateQuery;
