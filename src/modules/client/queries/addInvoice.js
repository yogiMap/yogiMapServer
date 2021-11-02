const Client = require('../Model');
const message = require('../../utils/messages');

const clientAddInvoiceQuery = ({ clientId, invoiceId }) => {
  return Client.updateOne(
    { _id: clientId },
    { $addToSet: { invoices: invoiceId } },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('Client add invoice is not updated');
      }
    })
    .catch((error) => {
      return message.fail('Client add invoice error', error);
    });
};

module.exports = clientAddInvoiceQuery;
