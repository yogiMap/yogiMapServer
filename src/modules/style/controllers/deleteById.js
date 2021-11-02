const Style = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const styleDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.styleId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  Style.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Style deleted'));
      } else {
        res.status(400).json(message.fail('Style not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('STYLE_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Style',
        entityId: _id,
        user: userId,
        controller: 'styleCreate',
      });

      res.status(400).json(message.fail('Style delete error', analyticsId));
    });
};

module.exports = styleDeleteById;
