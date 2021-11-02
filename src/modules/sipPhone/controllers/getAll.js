const SipPhone = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

// Такие контроллеры нельзя давать всем.
// Использовать только на начальных этапах
// так как ответ может быть слишком большим

const sipPhoneGetAll = (req, res) => {
  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  // Найти все
  SipPhone.find()
    .sort({ createdAt: -1 })
    // .select('name') // если нужно получить отдельные поля
    .exec()
    .then((docs) => {
      res.status(200).json(message.success('Get all sipPhones ok', docs));
    })
    .catch((error) => {
      const analyticsId = analytics('SipPhone_GET_ALL_ERROR', {
        error,
        body: req.body,
        entity: 'SipPhone',
        user: userId,
        controller: 'sipPhoneGetAll',
      });

      res.status(400).json(message.fail('SipPhone get all error', analyticsId));
    });
};

module.exports = sipPhoneGetAll;
