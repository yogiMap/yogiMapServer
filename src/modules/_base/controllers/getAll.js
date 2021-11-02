const Base = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

// Такие контроллеры нельзя давать всем.
// Использовать только на начальных этапах
// так как ответ может быть слишком большим

const baseGetAll = (req, res) => {
  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  // Найти все
  Base.find()
    .sort({ createdAt: -1 })
    // .select('name') // если нужно получить отдельные поля
    .exec()
    .then((docs) => {
      res.status(200).json(message.success('Get all bases ok', docs));
    })
    .catch((error) => {
      const analyticsId = analytics('BASE_GET_ALL_ERROR', {
        error,
        body: req.body,
        entity: 'Base',
        user: userId,
        controller: 'baseGetAll',
      });

      res.status(400).json(message.fail('Base get all error', analyticsId));
    });
};

module.exports = baseGetAll;
