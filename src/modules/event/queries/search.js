const Event = require('../Model');
const message = require('../../utils/messages');

function search({ query, page, limit }) {
  return Event.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .populate({
      path: 'teacherAccount',
      select: 'name',
    })

    .populate({
      path: 'style',
      select: 'name',
    })

    .populate({
      path: 'classType',
      select: 'name',
    })

    .exec()
    .then((docs) => {
      return message.success('Event found', docs);
    })
    .catch((error) => {
      return message.fail('Event search error', error);
    });
}

module.exports = search;
