const SipPhone = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const sipPhoneGetById = (req, res) => {
  const sipPhoneId = get(req, 'params.sipPhoneId');
  const userId = get(req, 'user._id');

  SipPhone.findById(sipPhoneId)
    .populate({
      path: 'owner',
      select: 'name',
    })
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('Get SipPhone by id ok', doc));
      } else {
        res.status(404).json(message.fail('No sipPhone for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('SipPhone_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'SipPhone',
        user: userId,
        controller: 'sipPhoneGetById',
      });

      res.status(400).json(message.fail('SipPhone get error', analyticsId));
    });
};

module.exports = sipPhoneGetById;
