const SipPhone = require('../Model');
const message = require('../../utils/messages');

const sipPhoneUpdateByIdQuery = ({ sipPhoneId, values }) => {
  return SipPhone.updateOne(
    { _id: sipPhoneId },
    { $set: values },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('SipPhone updated');
      } else {
        return message.fail('SipPhone not found');
      }
    })
    .catch((error) => {
      return message.fail('SipPhone update error', error);
    });
};

module.exports = sipPhoneUpdateByIdQuery;
