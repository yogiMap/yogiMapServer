const { get } = require('lodash');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { timeZoneList } = require('../timeZoneList');

const getTimeZoneList = (req, res) => {
  const userId = get(req, 'user._id', null);

  analytics('USER_GET_ALL_TIMEZONE_SUCCESS', {
    timeZone: timeZoneList,
    user: userId,
  });

  res.status(200).json(
    message.success(
      'Get all timeZone. Success',
      timeZoneList.map((el) => el.timeZone),
    ),
  );
};

module.exports = getTimeZoneList;
