const User = require('../userModel');
const message = require('../../utils/messages');

const userUpdateByIdQuery = ({ userId, values }) => {
  return User.updateOne({ _id: userId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('User updated');
      } else {
        return message.fail('User not found');
      }
    })
    .catch((error) => {
      return message.fail('User update error', error);
    });
};

module.exports = userUpdateByIdQuery;
