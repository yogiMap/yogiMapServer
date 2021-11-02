const User = require('../userModel');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const userGetAllLightweight = (req, res) => {
  const userId = get(req, 'user._id');

  User.find()
    .select('-email -resetPassword -shippingAddress')
    .exec()
    .then((docs) => {
      analytics('USER_GET_ALL_LIST_SUCCESS', {
        user: userId,
        usersCount: get(docs, 'length', null),
      });

      res.status(200).json(message.success('Get a list of all users. Success', docs));
    })
    .catch((error) => {
      const analyticsId = analytics('USER_GET_ALL_LIST_ERROR', {
        error,
        user: userId,
        controller: 'userGetAllLightweight',
      });

      res.status(400).json(message.fail('Get a list of all users. Error', analyticsId));
    });
};

module.exports = userGetAllLightweight;
