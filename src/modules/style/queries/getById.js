const Style = require('../Model');
const message = require('../../utils/messages');

const styleGetByIdQuery = (styleId) => {
  return Style.findById(styleId)
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Style get by id OK', doc);
      } else {
        return message.fail('No Style for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Style by id ERROR', err);
    });
};

module.exports = styleGetByIdQuery;
