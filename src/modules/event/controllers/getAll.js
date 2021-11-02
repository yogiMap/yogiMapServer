const Event = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

// Такие контроллеры нельзя давать всем.
// Использовать только на начальных этапах
// так как ответ может быть слишком большим

const eventGetAll = (req, res) => {
  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  // Найти все
  Event.find()
    .sort({ createdAt: -1 })
    // .select('name') // если нужно получить отдельные поля
    .exec()
    .then((docs) => {
      res.status(200).json(message.success('Get all event ok', docs));
    })
    .catch((error) => {
      const analyticsId = analytics('EVENT_GET_ALL_ERROR', {
        error,
        body: req.body,
        entity: 'Event',
        user: userId,
        controller: 'eventGetAll',
      });

      res.status(400).json(message.fail('Event get all error', analyticsId));
    });
};

module.exports = eventGetAll;
