const Event = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const eventDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.eventId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  Event.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Event deleted'));
      } else {
        res.status(400).json(message.fail('Event not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('EVENT_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Event',
        entityId: _id,
        user: userId,
        controller: 'eventCreate',
      });

      res.status(400).json(message.fail('Event delete error', analyticsId));
    });
};

module.exports = eventDeleteById;
