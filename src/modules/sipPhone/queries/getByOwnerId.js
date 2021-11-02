const SipPhone = require('../Model');
const message = require('../../utils/messages');

const sipPhoneGetByOwnerIdQuery = (ownerId) => {
  return SipPhone.findOne({ owner: ownerId })
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('SipPhone get by owner id OK', doc);
      } else {
        return message.fail('No SipPhone for provided owner id');
      }
    })
    .catch((err) => {
      return message.fail('Get SipPhone by owner id ERROR', err);
    });
};

module.exports = sipPhoneGetByOwnerIdQuery;
