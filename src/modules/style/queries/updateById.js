const Style = require('../Model');
const message = require('../../utils/messages');

const styleUpdateByIdQuery = ({ styleId, values }) => {
  return Style.updateOne({ _id: styleId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Style updated');
      } else {
        return message.fail('Style not found');
      }
    })
    .catch((error) => {
      return message.fail('Style update error', error);
    });
};

module.exports = styleUpdateByIdQuery;
