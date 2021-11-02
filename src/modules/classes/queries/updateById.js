const Classes = require('../Model');
const message = require('../../utils/messages');

const classesUpdateByIdQuery = ({ classesId, values }) => {
  return Classes.updateOne({ _id: classesId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Classes updated');
      } else {
        return message.fail('Classes not found');
      }
    })
    .catch((error) => {
      return message.fail('Classes update error', error);
    });
};

module.exports = classesUpdateByIdQuery;
