const Classes = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');

function getLastClasses(teacherAccountId) {
  return Classes.findOne(
    { teacherAccount: teacherAccountId },
    {},
    { sort: { createdAt: -1 } },
  )
    .exec()
    .then((doc) => {
      return message.success('Latest Class', doc);
    })
    .catch((error) => {
      console.log(error);
      return message.fail('Latest Class error', error);
    });
}

module.exports = async function getNextClassCodeQuery(teacherAccountId) {
  const getLastClassesResult = await getLastClasses(teacherAccountId);

  if (getLastClassesResult.success) {
    const classesCode = get(getLastClassesResult, 'payload.code');
    if (!classesCode) return 'CL-1';
    else {
      const currentCount = Number(classesCode.split('-')[1]);
      const nextCount = currentCount + 1;
      return `CL-${nextCount}`;
    }
  } else {
    return 'CL-1';
  }
};
