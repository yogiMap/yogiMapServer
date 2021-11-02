const SipPhone = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const sipPhoneDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.sipPhoneId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  SipPhone.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('SipPhone deleted'));
      } else {
        res.status(400).json(message.fail('SipPhone not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('SipPhone_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'SipPhone',
        entityId: _id,
        user: userId,
        controller: 'sipPhoneCreate',
      });

      res.status(400).json(message.fail('SipPhone delete error', analyticsId));
    });
};

module.exports = sipPhoneDeleteById;
