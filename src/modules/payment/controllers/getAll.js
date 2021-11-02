const Payment = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const paymentGetAll = (req, res) => {
  const userId = get(req, 'user._id');

  Payment.find()
    .sort({ createdAt: -1 })
    .exec()
    .then((docs) => {
      res.status(200).json(message.success('Get all payments ok', docs));
    })
    .catch((error) => {
      //
      const analyticsId = analytics('PAYMENT_GET_ALL_ERROR', {
        error,
        body: req.body,
        entity: 'Payment',
        user: userId,
        controller: 'paymentGetAll',
      });

      res.status(400).json(message.fail('Payment get all error', analyticsId));
    });
};

module.exports = paymentGetAll;
