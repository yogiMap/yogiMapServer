const SipPhone = require('../../sipPhone/Model');
const message = require('../../utils/messages');
const { get } = require('lodash');
const analytics = require('../../analytics/controllers/analytics');

const teacherGetSipPhone = async (req, res) => {
  const teacherAccountId = get(req, 'params.teacherAccountId');

  SipPhone.find({ teacherAccount: teacherAccountId })
    .sort({ createdAt: -1 })
    .populate({ path: 'owner', select: 'name' })
    .exec()
    .then((docs) => {
      res.status(200).json(message.success('Teacher SIP Phones', docs));
    })
    .catch((error) => {
      const analyticsId = analytics('TEACHER_GET_SIP_PHONE_ERROR', {
        error,
        body: teacherAccountId,
        controller: 'teacherGetSipPhone',
      });

      res.status(400).json(message.fail('Get Teacher SIP Phones error', analyticsId));
    });
};

module.exports = teacherGetSipPhone;
