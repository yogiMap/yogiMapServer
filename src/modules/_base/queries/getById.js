const Base = require('../Model');
const message = require('../../utils/messages');

const baseGetByIdQuery = (baseId) => {
  return Base.findById(baseId)
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Base get by id OK', doc);
      } else {
        return message.fail('No Base for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Base by id ERROR', err);
    });
};

module.exports = baseGetByIdQuery;
