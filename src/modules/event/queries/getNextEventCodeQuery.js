const Event = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');

function getLastEvent(teacherAccountId) {
  return Event.findOne(
    { teacherAccount: teacherAccountId },
    {},
    { sort: { createdAt: -1 } },
  )
    .exec()
    .then((doc) => {
      return message.success('Latest Event', doc);
    })
    .catch((error) => {
      console.log(error);
      return message.fail('Latest Event error', error);
    });
}

module.exports = async function getNextEventCodeQuery(teacherAccountId) {
  const getLastEventResult = await getLastEvent(teacherAccountId);

  if (getLastEventResult.success) {
    const eventCode = get(getLastEventResult, 'payload.code');
    if (!eventCode) return 'EV-1';
    else {
      const currentCount = Number(eventCode.split('-')[1]);
      const nextCount = currentCount + 1;
      return `EV-${nextCount}`;
    }
  } else {
    return 'EV-1';
  }
};
