const User = require('../userModel');
const message = require('../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../utils/escapeRegExp');
const analytics = require('../../analytics/controllers/analytics');

const userSearchHelper = async (req, res) => {
  const currentUserId = get(req, 'user._id', '');
  const name = get(req, 'body.name', '');

  User.find({
    name: { $regex: escapeRegExp(name), $options: 'i' },
  })
    .select('name')
    .exec()
    .then((docs) => {
      if (docs.length) {
        analytics('DIARY_USER_SEARCH_SUCCESS', {
          user: currentUserId,
          userSearchName: name,
        });

        res.status(200).json(message.success('Search Diary ok', docs.slice(0, 10)));
      } else {
        analytics('DIARY_USER_SEARCH_FAIL', {
          user: currentUserId,
          userSearchName: name,
          controller: 'userSearchHelper',
        });

        res.status(400).json(message.fail('No users for provided id', []));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('DIARY_USER_SEARCH_ERROR', {
        error: error.message,
        user: currentUserId,
        controller: 'userSearchHelper',
      });

      res.status(400).json(message.fail('Search Diary error', analyticsId));
    });
};

module.exports = userSearchHelper;
