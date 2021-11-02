const Base = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const baseDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.baseId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  Base.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Base deleted'));
      } else {
        res.status(400).json(message.fail('Base not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('BASE_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Base',
        entityId: _id,
        user: userId,
        controller: 'baseCreate',
      });

      res.status(400).json(message.fail('Base delete error', analyticsId));
    });
};

module.exports = baseDeleteById;
