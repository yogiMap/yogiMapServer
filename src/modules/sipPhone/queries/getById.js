const SipPhone = require('../Model');
const message = require('../../utils/messages');

const sipPhoneGetByIdQuery = (sipPhoneId) => {
  return SipPhone.findById(sipPhoneId)
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('SipPhone get by id OK', doc);
      } else {
        return message.fail('No SipPhone for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get SipPhone by id ERROR', err);
    });
};

module.exports = sipPhoneGetByIdQuery;
