const Base = require('../Model');
const message = require('../../utils/messages');

const baseUpdateByIdQuery = ({ baseId, values }) => {
  return Base.updateOne({ _id: baseId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Base updated');
      } else {
        return message.fail('Base not found');
      }
    })
    .catch((error) => {
      return message.fail('Base update error', error);
    });
};

module.exports = baseUpdateByIdQuery;
