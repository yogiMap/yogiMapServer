const Client = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const mongoose = require('mongoose');

const clientGetInfoById = (req, res) => {
  const clientId = get(req, 'params.clientId');
  const userId = get(req, 'user._id');

  Client.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(clientId) } },

    {
      $lookup: {
        from: 'addresses',
        pipeline: [
          {
            $match: {
              isDefault: true,
              client: mongoose.Types.ObjectId(clientId),
              owner: mongoose.Types.ObjectId(userId),
            },
          },
        ],
        as: 'address',
      },
    },

    { $addFields: { address: { $arrayElemAt: ['$address', 0] } } },
  ])
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('Get Client by id ok', doc[0]));
      } else {
        res.status(404).json(message.fail('No client for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('CLIENT_GET_INFO_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Client',
        user: userId,
        controller: 'clientGetInfoById',
      });

      res.status(400).json(message.fail('Client get error', analyticsId));
    });
};

module.exports = clientGetInfoById;
