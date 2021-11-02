const Client = require('../Model');
const message = require('../../utils/messages');

const clientSearchQuery = ({ query, page, limit }) => {
  return Client.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .populate({
      path: 'teacherAccount',
      select: 'name',
    })

    .exec()
    .then((docs) => {
      return message.success('Client found', docs);
    })
    .catch((error) => {
      return message.fail('Client search error', error);
    });
};

module.exports = clientSearchQuery;
