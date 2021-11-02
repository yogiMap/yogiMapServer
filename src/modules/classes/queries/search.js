const Classes = require('../Model');
const message = require('../../utils/messages');

function search({ query, page, limit }) {
  return Classes.find(query)
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
      return message.success('Class found', docs);
    })
    .catch((error) => {
      return message.fail('Class search error', error);
    });
}

module.exports = search;
