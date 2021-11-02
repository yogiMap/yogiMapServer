const ClassType = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const classTypeDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.classTypeId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  ClassType.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('ClassType deleted'));
      } else {
        res.status(400).json(message.fail('ClassType not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('ClassType_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'ClassType',
        entityId: _id,
        user: userId,
        controller: 'classTypeCreate',
      });

      res.status(400).json(message.fail('ClassType delete error', analyticsId));
    });
};

module.exports = classTypeDeleteById;
