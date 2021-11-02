const { get } = require('lodash');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { focusList } = require('../focusList');

const getFocusList = (req, res) => {
  const userId = get(req, 'user._id', null);

  analytics('USER_GET_ALL_FOCUS_SUCCESS', {
    focus: focusList,
    user: userId,
  });

  res.status(200).json(
    message.success(
      'Get all focus. Success',
      focusList.map((el) => el),
    ),
  );
};

module.exports = getFocusList;
