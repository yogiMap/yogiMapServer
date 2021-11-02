const ClassType = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

// Такие контроллеры нельзя давать всем.
// Использовать только на начальных этапах
// так как ответ может быть слишком большим

const classTypeGetAll = (req, res) => {
  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  // Найти все
  ClassType.find()
    .sort({ c })
    // .select('name') // если нужно получить отдельные поля
    .exec()
    .then((docs) => {
      res.status(200).json(message.success('Get all classTypes ok', docs));
    })
    .catch((error) => {
      const analyticsId = analytics('ClassType_GET_ALL_ERROR', {
        error,
        body: req.body,
        entity: 'ClassType',
        user: userId,
        controller: 'classTypeGetAll',
      });

      res.status(400).json(message.fail('ClassType get all error', analyticsId));
    });
};

module.exports = classTypeGetAll;
