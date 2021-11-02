const Email = require( '../Model');
const message = require( '../../utils/messages');
const analytics = require( '../../analytics/controllers/analytics');
const { get } = require( 'lodash');

const emailDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.emailId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  Email.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Email deleted'));
      } else {
        res.status(400).json(message.fail('Email not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('EMAIL_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Email',
        entityId: _id,
        user: userId,
        controller: 'emailCreate',
      });

      res.status(400).json(message.fail('Email delete error', analyticsId));
    });
};

module.exports = emailDeleteById;
