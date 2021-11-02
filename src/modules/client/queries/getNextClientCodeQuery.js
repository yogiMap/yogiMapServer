const Client = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');

function getLastClient(teacherAccountId) {
  return Client.findOne(
    { teacherAccount: teacherAccountId },
    {},
    { sort: { createdAt: -1 } },
  )
    .exec()
    .then((doc) => {
      return message.success('Latest Client', doc);
    })
    .catch((error) => {
      console.log(error);
      return message.fail('Latest Client error', error);
    });
}

module.exports = async function getNextClientCodeQuery(teacherAccountId) {
  const getLastClientResult = await getLastClient(teacherAccountId);

  if (getLastClientResult.success) {
    const clientCode = get(getLastClientResult, 'payload.code');
    if (!clientCode) return 'CL-1';
    else {
      const currentCount = Number(clientCode.split('-')[1]);
      const nextCount = currentCount + 1;
      return `CL-${nextCount}`;
    }
  } else {
    return 'CL-1';
  }
};
