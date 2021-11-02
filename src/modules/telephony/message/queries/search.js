const Message = require('../Model');
const message = require('../../../utils/messages');

module.exports = function messageSearchQuery({ query, page, limit }) {
  return Message.find(query)
    .sort({ createdAt: 1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .populate({
      path: 'client',
      select: 'name',
    })
    .populate({
      path: 'owner',
      select: 'name',
    })
    .exec()
    .then((docs) => {
      return message.success('Messages found', docs);
    })
    .catch((error) => {
      return message.fail('Message search error', error);
    });
};
