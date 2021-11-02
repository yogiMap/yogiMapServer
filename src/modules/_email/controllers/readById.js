const Email = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const emailReadById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.emailId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  Email.updateOne({ _id }, { $set: { isRead: true } }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Email marked as Read'));
      } else {
        res.status(400).json(message.fail('Email not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('EMAIL_READ_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Email',
        entityId: _id,
        user: userId,
        controller: 'emailRead',
      });

      res.status(400).json(message.fail('Email read error', analyticsId));
    });
};

module.exports = emailReadById;
