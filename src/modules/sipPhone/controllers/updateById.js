const SipPhone = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

module.exports = async function sipPhoneUpdateById(req, res) {
  const sipPhoneId = get(req, 'params.sipPhoneId');
  const userId = get(req, 'user._id');

  SipPhone.updateOne({ _id: sipPhoneId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('SipPhone updated'));
      } else {
        res.status(400).json(message.fail('SipPhone not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('SipPhone_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'SipPhone',
        entityId: sipPhoneId,
        user: userId,
        controller: 'sipPhoneUpdateById',
      });

      res.status(400).json(message.fail('SipPhone update error', analyticsId));
    });
};
