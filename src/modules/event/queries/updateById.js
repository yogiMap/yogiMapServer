const Event = require('../Model');
const message = require('../../utils/messages');

const eventUpdateByIdQuery = ({ eventId, values }) => {
  return Event.updateOne({ _id: eventId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Event updated');
      } else {
        return message.fail('Event not found');
      }
    })
    .catch((error) => {
      return message.fail('Event update error', error);
    });
};

module.exports = eventUpdateByIdQuery;
