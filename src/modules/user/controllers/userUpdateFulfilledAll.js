const User = require('../userModel');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');

const userUpdateFulfilledAll = async (req, res) => {
  // await User.updateMany({}, { $set: { fulfilled: null } });
  const userId = get(req, 'user._id');
  const setFulfilledFalse = await User.updateMany(
    {
      $or: [
        { 'links.linkedIn': { $exists: false } },
        { 'links.facebook': { $exists: false } },
        { 'links.resume': { $exists: false } },
        { 'links.github': { $exists: false } },
        { 'links.codewarsUsername': { $exists: false } },

        { about: { $exists: false } },
        { about: { $eq: '' } },

        { goals: { $exists: false } },
        { goals: { $eq: '' } },

        { englishLevel: { $exists: false } },
        { englishLevel: { $eq: '' } },
      ],
    },

    { $set: { fulfilled: false } },
    { runValidators: true },
  )
    .then((report) => {
      return message.success('ok', report);
    })
    .catch((error) => {
      const analyticsId = analytics('USER_UPDATE_FULFILLED_ALL_ERROR', {
        error,
        user: userId,
        controller: 'userUpdateFulfilledAll',
      });

      return res
        .status(400)
        .json(message.fail('User update fulfilled all. Error', analyticsId));
    });

  const setFulfilledTrue = await User.updateMany(
    {
      $and: [
        { 'links.linkedIn': { $exists: true } },
        { 'links.facebook': { $exists: true } },
        { 'links.resume': { $exists: true } },
        { 'links.github': { $exists: true } },
        { 'links.codewarsUsername': { $exists: true } },

        { about: { $exists: true, $ne: '' } },
        { goals: { $exists: true, $ne: '' } },
        { englishLevel: { $exists: true, $ne: '' } },
      ],
    },

    { $set: { fulfilled: true } },
    { runValidators: true },
  )
    .then((report) => {
      return message.success('ok', report);
    })
    .catch((error) => {
      const analyticsId = analytics('USER_UPDATE_FULFILLED_ALL_ERROR', {
        error,
        user: userId,
        controller: 'userUpdateFulfilledAll',
      });

      return res
        .status(400)
        .json(message.fail('User update fulfilled all. Error', analyticsId));
    });

  res.status(200).json(
    message.success('Total ok', {
      false: setFulfilledFalse.payload,
      true: setFulfilledTrue.payload,
    }),
  );
};

module.exports = userUpdateFulfilledAll;
