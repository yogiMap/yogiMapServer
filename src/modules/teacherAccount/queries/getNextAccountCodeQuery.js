const TeacherAccount = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');

function getLastAccount() {
  return TeacherAccount.findOne({}, {}, { sort: { createdAt: -1 } })
    .exec()
    .then((doc) => {
      return message.success('Latest Account', doc);
    })
    .catch((error) => {
      return message.fail('Latest Account error', error);
    });
}

module.exports = async function getNextAccountCodeQuery() {
  const getLastAccountResult = await getLastAccount();

  if (getLastAccountResult.success) {
    const accountCode = get(getLastAccountResult, 'payload.code');
    if (!accountCode) return 'TA-1';
    else {
      const currentCount = Number(accountCode.split('-')[1]);
      const nextCount = currentCount + 1;
      return `TA-${nextCount}`;
    }
  } else {
    return 'TA-1';
  }
};
