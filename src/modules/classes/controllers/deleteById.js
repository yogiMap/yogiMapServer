const Classes = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const classesDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.classesId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  Classes.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Classes deleted'));
      } else {
        res.status(400).json(message.fail('Classes not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('CLASSES_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Classes',
        entityId: _id,
        user: userId,
        controller: 'classesCreate',
      });

      res.status(400).json(message.fail('Classes delete error', analyticsId));
    });
};

module.exports = classesDeleteById;
