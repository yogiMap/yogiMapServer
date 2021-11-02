const SipPhone = require('../Model');
const message = require('../../utils/messages');

const sipPhoneGetByPhoneNumberQuery = (phoneNumber) => {
  return SipPhone.findOne({ phoneNumber })
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('SipPhone get by Phone Number OK', doc);
      } else {
        return message.fail('No SipPhone for provided Phone Number');
      }
    })
    .catch((err) => {
      return message.fail('Get SipPhone by Phone Number ERROR', err);
    });
};

module.exports = sipPhoneGetByPhoneNumberQuery;
