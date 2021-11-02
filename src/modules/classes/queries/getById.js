const Classes = require('../Model');
const message = require('../../utils/messages');

const classesGetByIdQuery = (classesId) => {
  return Classes.findById(classesId)
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Classes get by id OK', doc);
      } else {
        return message.fail('No Classes for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Classes by id ERROR', err);
    });
};

module.exports = classesGetByIdQuery;
